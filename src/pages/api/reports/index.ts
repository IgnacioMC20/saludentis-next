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

        // Fetch all data
        // For better UX, we fetch all historical data and filter in memory when needed
        const [allConsultations, balances, patients, quotations, treatments] = await Promise.all([
            Consultation.find().lean(),
            Balance.find().lean(),
            Patient.find().lean(),
            Quotation.find().lean(),
            Treatment.find().lean()
        ])

        // Filter consultations by date range for revenue calculations
        const consultations = allConsultations.filter(c => {
            if (!c.createdAt) return false
            const created = new Date(c.createdAt)
            return created >= filters.startDate! && created <= filters.endDate!
        })

        // Create patient map for quick lookup
        const patientMap = new Map(
            patients.map(p => [p._id.toString(), p])
        )

        // Create treatment map for quick lookup
        const treatmentMap = new Map(
            treatments.map(t => [t._id.toString(), t])
        )

        // Calculate KPIs using all consultations for historical totals
        const totalRevenue = calculateTotalRevenue(allConsultations)
        const collectedPayments = calculateCollectedPayments(balances)
        const outstandingBalances = calculateOutstandingBalances(balances)
        const pendingCollections = calculatePendingCollections(balances)

        // Count new patients in date range
        const newPatients = patients.filter(p => {
            if (!p.createdAt) return false
            const created = new Date(p.createdAt)
            return created >= filters.startDate! && created <= filters.endDate!
        }).length

        // Get unique patients from ALL consultations (not just filtered ones)
        const allUniquePatientIds = new Set(
            allConsultations.map(c => c.patientId?.toString()).filter(Boolean)
        )

        // Get unique patients from filtered consultations
        const filteredUniquePatientIds = new Set(
            consultations.map(c => c.patientId?.toString()).filter(Boolean)
        )

        const kpis = {
            totalRevenue,
            collectedPayments,
            outstandingBalances,
            pendingCollections,
            consultationsCount: allConsultations.length, // Show total consultations
            patientsSeen: allUniquePatientIds.size, // Show all unique patients
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

        // Consultations table data - use all consultations and sort by date
        const consultationsData: IConsultationRow[] = allConsultations
            .map(consultation => {
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
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
            .slice(0, 50) // Limit to 50 most recent consultations

        // Quotation funnel - use all consultations for conversion tracking
        const totalQuoted = quotations.reduce((sum, q) => sum + (q.total || 0), 0)
        const quotationsCount = quotations.length
        
        // Create a map of quotation IDs by patient for better tracking
        const quotationsByPatient = new Map<string, any[]>()
        quotations.forEach(q => {
            const patientId = q.patientId?.toString()
            if (patientId) {
                if (!quotationsByPatient.has(patientId)) {
                    quotationsByPatient.set(patientId, [])
                }
                quotationsByPatient.get(patientId)!.push(q)
            }
        })
        
        // Find consultations that happened after quotations for the same patient
        let convertedAmount = 0
        const convertedPatients = new Set<string>()
        
        // Use ALL consultations for conversion tracking
        allConsultations.forEach(consultation => {
            const patientId = consultation.patientId?.toString()
            if (patientId && quotationsByPatient.has(patientId)) {
                const patientQuotations = quotationsByPatient.get(patientId)!
                // Check if consultation happened after any quotation
                const hasQuotationBefore = patientQuotations.some(q => {
                    const quotationDate = new Date(q.createdAt || q.updatedAt || new Date())
                    const consultationDate = new Date(consultation.createdAt || new Date())
                    return quotationDate <= consultationDate
                })
                
                if (hasQuotationBefore && !convertedPatients.has(patientId)) {
                    convertedPatients.add(patientId)
                    convertedAmount += (consultation.total || 0)
                }
            }
        })

        const quotationFunnel = {
            totalQuoted,
            convertedAmount,
            conversionRate: quotationsCount > 0 ? (convertedPatients.size / quotationsCount) * 100 : 0,
            quotationsCount,
            convertedCount: convertedPatients.size
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