import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import {
    IReportsData,
    IReportFilters,
    IPatientBalance,
    IConsultationRow,
    ITreatmentRevenue
} from '@/interfaces/reports'
import Balance from '@/models/Balance'
import Consultation from '@/models/Consultation'
import Patient from '@/models/Patient'
import Quotation from '@/models/Quotation'
import Treatment from '@/models/Treatment'
import { getFullName } from '@/utils'
import {
    calculateTotalRevenue,
    calculateCollectedPayments,
    calculateOutstandingBalances,
    calculatePendingCollections,
    groupRevenueByPeriod,
    calculateARAgingBuckets,
    calculatePaidForConsultation
} from '@/utils/reportMetrics'

type Data =
    | { message: string; success: boolean }
    | { data: IReportsData; message: string; success: boolean }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false })
    }

    try {
        await db.connect()

        // Parse query parameters
        const {
            startDate,
            endDate,
            groupBy = 'month',
            page = '1',
            pageSize = '10'
        } = req.query

        const filters: Partial<IReportFilters> = {
            startDate: startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1),
            endDate: endDate ? new Date(endDate as string) : new Date(),
            groupBy: (groupBy as 'day' | 'week' | 'month') || 'month'
        }

        const pageNum = parseInt(page as string)
        const pageSizeNum = parseInt(pageSize as string)

        // Fetch all data within date range
        const [consultations, balances, patients, quotations, treatments] = await Promise.all([
            Consultation.find({
                createdAt: { $gte: filters.startDate, $lte: filters.endDate }
            }).lean(),
            Balance.find().lean(),
            Patient.find().lean(),
            Quotation.find({
                createdAt: { $gte: filters.startDate, $lte: filters.endDate }
            }).lean(),
            Treatment.find().lean()
        ])

        // Create patient map for quick lookup
        const patientMap = new Map(
            patients.map(p => [p._id.toString(), p])
        )

        // Create treatment map for quick lookup
        const treatmentMap = new Map(
            treatments.map(t => [t._id.toString(), t])
        )

        // Calculate KPIs
        const totalRevenue = calculateTotalRevenue(consultations)
        const collectedPayments = calculateCollectedPayments(balances)
        const outstandingBalances = calculateOutstandingBalances(balances)
        const pendingCollections = calculatePendingCollections(balances)

        // Count new patients in date range
        const newPatients = patients.filter(p => {
            if (!p.createdAt) return false
            const created = new Date(p.createdAt)
            return created >= filters.startDate! && created <= filters.endDate!
        }).length

        // Get unique patients from consultations
        const uniquePatientIds = new Set(
            consultations.map(c => c.patientId?.toString()).filter(Boolean)
        )

        const kpis = {
            totalRevenue,
            collectedPayments,
            outstandingBalances,
            pendingCollections,
            consultationsCount: consultations.length,
            patientsSeen: uniquePatientIds.size,
            newPatients
        }

        // Revenue trend
        const revenueTrend = groupRevenueByPeriod(
            consultations,
            balances,
            filters.groupBy!
        )

        // A/R Aging
        const arAging = calculateARAgingBuckets(balances, patientMap)

        // Top treatments by revenue
        const treatmentRevenue = new Map<string, { revenue: number; count: number }>()
        consultations.forEach(consultation => {
            consultation.consultationDetails?.forEach(detail => {
                const treatmentId = detail.treatmentId?.toString()
                if (treatmentId) {
                    const current = treatmentRevenue.get(treatmentId) || { revenue: 0, count: 0 }
                    const treatment = treatmentMap.get(treatmentId)
                    const price = treatment?.price || 0
                    current.revenue += price
                    current.count += 1
                    treatmentRevenue.set(treatmentId, current)
                }
            })
        })

        const topTreatments: ITreatmentRevenue[] = Array.from(treatmentRevenue.entries())
            .map(([treatmentId, data]) => {
                const treatment = treatmentMap.get(treatmentId)
                return {
                    treatmentId,
                    treatmentName: treatment?.description || 'Unknown',
                    revenue: data.revenue,
                    count: data.count
                }
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)

        // Top patients by balance
        const topPatients: IPatientBalance[] = balances
            .filter(b => (b.balance || 0) > 0)
            .map(balance => {
                const patient = patientMap.get(balance.patientId?.toString() || '')
                const pending = (balance.balanceDetails || []).reduce((sum, detail) => {
                    return sum + ((detail.total || 0) - (detail.amount || 0))
                }, 0)

                return {
                    patientId: balance.patientId?.toString() || '',
                    patientName: patient ? getFullName(patient.firstName, patient.middleName, patient.lastName) : 'Unknown',
                    nationalId: patient?.nationalId || '',
                    lastVisit: patient?.lastVisit || null,
                    balance: balance.balance || 0,
                    pending,
                    phone: patient?.phone || 0,
                    email: patient?.email || '',
                    status: ((balance.balance || 0) > 0 ? 'Due' : 'Clear') as 'Due' | 'Clear'
                }
            })
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 10)

        // Patient balances with pagination
        const allPatientBalances: IPatientBalance[] = balances.map(balance => {
            const patient = patientMap.get(balance.patientId?.toString() || '')
            const pending = (balance.balanceDetails || []).reduce((sum, detail) => {
                return sum + ((detail.total || 0) - (detail.amount || 0))
            }, 0)

            return {
                patientId: balance.patientId?.toString() || '',
                patientName: patient ? getFullName(patient.firstName, patient.middleName, patient.lastName) : 'Unknown',
                nationalId: patient?.nationalId || '',
                lastVisit: patient?.lastVisit || null,
                balance: balance.balance || 0,
                pending,
                phone: patient?.phone || 0,
                email: patient?.email || '',
                status: ((balance.balance || 0) > 0 ? 'Due' : 'Clear') as 'Due' | 'Clear'
            }
        })

        const startIndex = (pageNum - 1) * pageSizeNum
        const paginatedBalances = allPatientBalances.slice(startIndex, startIndex + pageSizeNum)

        // Consultations table data
        const consultationsData: IConsultationRow[] = consultations.map(consultation => {
            const patient = patientMap.get(consultation.patientId?.toString() || '')
            const balance = balances.find(b => b.patientId?.toString() === consultation.patientId?.toString())
            const paid = balance ? calculatePaidForConsultation(
                consultation._id.toString(),
                balance.balanceDetails || []
            ) : 0

            return {
                consultationId: consultation._id.toString(),
                date: consultation.createdAt || new Date(),
                patientName: patient ? getFullName(patient.firstName, patient.middleName, patient.lastName) : 'Unknown',
                patientId: consultation.patientId?.toString() || '',
                total: consultation.total || 0,
                paid,
                due: (consultation.total || 0) - paid,
                treatmentsCount: consultation.consultationDetails?.length || 0
            }
        })

        // Quotation funnel
        const totalQuoted = quotations.reduce((sum, q) => sum + (q.total || 0), 0)
        const quotationPatientIds = new Set(quotations.map(q => q.patientId?.toString()))
        
        // Find consultations from patients who had quotations
        const convertedConsultations = consultations.filter(c => 
            quotationPatientIds.has(c.patientId?.toString())
        )
        const convertedAmount = convertedConsultations.reduce((sum, c) => sum + (c.total || 0), 0)

        const quotationFunnel = {
            totalQuoted,
            convertedAmount,
            conversionRate: totalQuoted > 0 ? (convertedAmount / totalQuoted) * 100 : 0,
            quotationsCount: quotations.length,
            convertedCount: convertedConsultations.length
        }

        const reportsData: IReportsData = {
            kpis,
            revenueTrend,
            arAging,
            topTreatments,
            topPatients,
            patientBalances: {
                data: paginatedBalances,
                total: allPatientBalances.length,
                page: pageNum,
                pageSize: pageSizeNum
            },
            consultations: consultationsData,
            quotationFunnel
        }

        await db.disconnect()

        return res.status(200).json({
            data: reportsData,
            message: 'Reports data retrieved successfully',
            success: true
        })

    } catch (error) {
        console.error('Error fetching reports data:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error fetching reports data',
            success: false
        })
    }
}