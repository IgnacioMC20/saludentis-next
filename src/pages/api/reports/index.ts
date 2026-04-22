import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import {
    CONSULTATION_STATUS_OPTIONS,
    ConsultationStatus,
    IConsultationRow,
    IReportFilters,
    IReportsData,
    IPatientBalance,
    ITreatmentRevenue,
} from '@/interfaces/reports'
import Balance, { IBalance } from '@/models/Balance'
import Consultation, { IConsultation } from '@/models/Consultation'
import Patient from '@/models/Patient'
import Quotation from '@/models/Quotation'
import Treatment from '@/models/Treatment'
import { getFullName } from '@/utils'
import {
    calculateAgeMixMetrics,
    calculateAppointmentStatusMetrics,
    calculateARAgingBuckets,
    calculateCollectedPayments,
    calculateOutstandingBalances,
    calculatePaidForConsultation,
    calculatePendingCollectionsCount,
    calculateTotalRevenue,
    createMetricComparison,
    getConsultationDefaults,
    getPatientBalanceStatus,
    getPreviousPeriodRange,
    groupRevenueByPeriod,
} from '@/utils/reportMetrics'

type Data =
    | { message: string; success: boolean }
    | { data: IReportsData; message: string; success: boolean }

type NormalizedConsultation = IConsultation & {
    _id: { toString: () => string };
    status: ConsultationStatus;
    doctorName: string;
    siteName: string;
}

type RelevantBalanceDetail = {
    patientId: string;
    consultationId: string;
    amount: number;
    total: number;
    pending: number;
    createdAt: Date | null;
}

const parseDateQuery = (value: string | string[] | undefined, endOfDay = false) => {
    if (!value || Array.isArray(value)) return null

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return null

    if (endOfDay) {
        parsedDate.setHours(23, 59, 59, 999)
    } else {
        parsedDate.setHours(0, 0, 0, 0)
    }

    return parsedDate
}

const normalizeConsultation = (consultation: any): NormalizedConsultation => ({
    ...consultation,
    ...getConsultationDefaults(consultation),
})

const matchesConsultationFilters = (
    consultation: NormalizedConsultation,
    filters: Partial<IReportFilters>
) => {
    if (!consultation.createdAt) return false

    const createdAt = new Date(consultation.createdAt)
    if (createdAt < filters.startDate! || createdAt > filters.endDate!) return false
    if (filters.siteName && consultation.siteName !== filters.siteName) return false
    if (filters.doctorName && consultation.doctorName !== filters.doctorName) return false
    if (
        filters.consultationStatus
        && filters.consultationStatus !== 'todos'
        && consultation.status !== filters.consultationStatus
    ) return false

    return true
}

const buildRelevantBalanceDetails = (
    balances: IBalance[],
    consultationIds: Set<string>
): RelevantBalanceDetail[] => {
    return balances.flatMap(balance => {
        const patientId = balance.patientId?.toString() || ''

        return (balance.balanceDetails || [])
            .map(detail => ({
                patientId,
                consultationId: detail.consultationId?.toString() || '',
                amount: detail.amount || 0,
                total: detail.total || 0,
                pending: Math.max((detail.total || 0) - (detail.amount || 0), 0),
                createdAt: detail.createdAt ? new Date(detail.createdAt) : null,
            }))
            .filter(detail => detail.consultationId && consultationIds.has(detail.consultationId))
    })
}

const buildPatientBalances = (
    details: RelevantBalanceDetail[],
    patients: Map<string, any>
): IPatientBalance[] => {
    const grouped = new Map<string, {
        balance: number;
        pending: number;
        oldestPendingDate: Date | null;
    }>()

    details.forEach(detail => {
        const current = grouped.get(detail.patientId) || {
            balance: 0,
            pending: 0,
            oldestPendingDate: null,
        }

        current.balance += detail.total
        current.pending += detail.pending

        if (
            detail.pending > 0
            && detail.createdAt
            && (!current.oldestPendingDate || detail.createdAt < current.oldestPendingDate)
        ) {
            current.oldestPendingDate = detail.createdAt
        }

        grouped.set(detail.patientId, current)
    })

    return Array.from(grouped.entries()).map(([patientId, aggregate]) => {
        const patient = patients.get(patientId)
        const patientName = patient
            ? getFullName(patient.firstName, patient.middleName, patient.lastName)
            : 'Paciente desconocido'
        const phone = patient?.phone || null
        const email = patient?.email || ''
        const contact = phone ? phone.toString() : email || 'N/A'
        const daysPastDue = aggregate.oldestPendingDate
            ? Math.max(0, Math.floor((Date.now() - aggregate.oldestPendingDate.getTime()) / (1000 * 60 * 60 * 24)))
            : 0

        return {
            patientId,
            patientName,
            nationalId: patient?.nationalId || '',
            lastVisit: patient?.lastVisit || null,
            balance: aggregate.balance,
            pending: aggregate.pending,
            phone,
            email,
            contact,
            status: getPatientBalanceStatus(daysPastDue, aggregate.pending),
            daysPastDue,
        }
    })
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false })
    }

    try {
        await db.connect()

        const {
            startDate,
            endDate,
            groupBy = 'month',
            page = '1',
            pageSize = '10',
            siteName,
            doctorName,
            consultationStatus,
            patientSearch = '',
        } = req.query

        const defaultEndDate = parseDateQuery(undefined, true) || new Date()
        const filters: Partial<IReportFilters> = {
            startDate: parseDateQuery(startDate as string) || new Date(new Date().getFullYear(), 0, 1),
            endDate: parseDateQuery(endDate as string, true) || defaultEndDate,
            groupBy: (groupBy as 'day' | 'week' | 'month') || 'month',
            siteName: typeof siteName === 'string' && siteName !== 'todos' ? siteName : undefined,
            doctorName: typeof doctorName === 'string' && doctorName !== 'todos' ? doctorName : undefined,
            consultationStatus:
                typeof consultationStatus === 'string' && consultationStatus !== 'todos'
                    ? consultationStatus as ConsultationStatus
                    : undefined,
            patientSearch: typeof patientSearch === 'string' ? patientSearch.trim().toLowerCase() : '',
        }

        const pageNum = Number.parseInt(page as string, 10) || 1
        const pageSizeNum = Number.parseInt(pageSize as string, 10) || 10

        const [consultationDocs, balances, patients, quotations, treatments] = await Promise.all([
            Consultation.find().lean(),
            Balance.find().lean(),
            Patient.find().lean(),
            Quotation.find().lean(),
            Treatment.find().lean(),
        ])

        const allConsultations = consultationDocs.map(normalizeConsultation)
        const patientMap = new Map(patients.map(patient => [patient._id.toString(), patient]))
        const treatmentMap = new Map(treatments.map(treatment => [treatment._id.toString(), treatment]))

        const currentConsultations = allConsultations.filter(consultation => {
            return matchesConsultationFilters(consultation, filters)
        })

        const { previousStart, previousEnd } = getPreviousPeriodRange(
            filters.startDate!,
            filters.endDate!
        )
        const previousFilters: Partial<IReportFilters> = {
            ...filters,
            startDate: previousStart,
            endDate: previousEnd,
        }

        const previousConsultations = allConsultations.filter(consultation => {
            return matchesConsultationFilters(consultation, previousFilters)
        })

        const currentConsultationIds = new Set(
            currentConsultations.map(consultation => consultation._id.toString())
        )
        const previousConsultationIds = new Set(
            previousConsultations.map(consultation => consultation._id.toString())
        )

        const allPatientSearch = filters.patientSearch || ''
        const matchesPatientSearch = (value: string) =>
            !allPatientSearch || value.toLowerCase().includes(allPatientSearch)

        const currentRelevantBalanceDetails = buildRelevantBalanceDetails(
            balances,
            currentConsultationIds
        )
        const currentPatientsSeen = new Set(
            currentConsultations.map(consultation => consultation.patientId?.toString()).filter(Boolean)
        ).size
        const previousPatientsSeen = new Set(
            previousConsultations.map(consultation => consultation.patientId?.toString()).filter(Boolean)
        ).size

        const currentNewPatients = patients.filter(patient => {
            if (!patient.createdAt) return false
            const createdAt = new Date(patient.createdAt)
            return createdAt >= filters.startDate! && createdAt <= filters.endDate!
        }).length
        const previousNewPatients = patients.filter(patient => {
            if (!patient.createdAt) return false
            const createdAt = new Date(patient.createdAt)
            return createdAt >= previousStart && createdAt <= previousEnd
        }).length

        const kpis = {
            totalRevenue: calculateTotalRevenue(currentConsultations),
            collectedPayments: calculateCollectedPayments(balances, currentConsultationIds),
            outstandingBalances: calculateOutstandingBalances(balances, currentConsultationIds),
            consultationsCount: currentConsultations.length,
            patientsSeen: currentPatientsSeen,
            newPatients: currentNewPatients,
            pendingCollectionsCount: calculatePendingCollectionsCount(balances, currentConsultationIds),
        }

        const previousKpis = {
            totalRevenue: calculateTotalRevenue(previousConsultations),
            collectedPayments: calculateCollectedPayments(balances, previousConsultationIds),
            outstandingBalances: calculateOutstandingBalances(balances, previousConsultationIds),
            consultationsCount: previousConsultations.length,
            patientsSeen: previousPatientsSeen,
            newPatients: previousNewPatients,
            pendingCollectionsCount: calculatePendingCollectionsCount(balances, previousConsultationIds),
        }

        const comparisons = {
            totalRevenue: createMetricComparison(
                kpis.totalRevenue,
                previousKpis.totalRevenue,
                'vs periodo anterior'
            ),
            collectedPayments: createMetricComparison(
                kpis.collectedPayments,
                previousKpis.collectedPayments,
                'vs periodo anterior'
            ),
            outstandingBalances: createMetricComparison(
                kpis.outstandingBalances,
                previousKpis.outstandingBalances,
                'vs periodo anterior'
            ),
            consultationsCount: createMetricComparison(
                kpis.consultationsCount,
                previousKpis.consultationsCount,
                'vs periodo anterior'
            ),
            patientsSeen: createMetricComparison(
                kpis.patientsSeen,
                previousKpis.patientsSeen,
                'vs periodo anterior'
            ),
            newPatients: createMetricComparison(
                kpis.newPatients,
                previousKpis.newPatients,
                'vs periodo anterior'
            ),
            pendingCollectionsCount: createMetricComparison(
                kpis.pendingCollectionsCount,
                previousKpis.pendingCollectionsCount,
                'vs periodo anterior'
            ),
        }

        const revenueTrend = groupRevenueByPeriod(
            currentConsultations,
            balances,
            filters.groupBy!,
            currentConsultationIds
        )
        const arAging = calculateARAgingBuckets(balances, patientMap, currentConsultationIds)
        const ageMix = calculateAgeMixMetrics(patients as any[])
        const appointmentStatus = calculateAppointmentStatusMetrics(currentConsultations)

        const treatmentRevenue = new Map<string, { revenue: number; count: number }>()
        currentConsultations.forEach(consultation => {
            consultation.consultationDetails?.forEach(detail => {
                const treatmentId = detail.treatmentId?.toString()
                if (!treatmentId) return

                const current = treatmentRevenue.get(treatmentId) || { revenue: 0, count: 0 }
                const treatment = treatmentMap.get(treatmentId)
                current.revenue += treatment?.price || 0
                current.count += 1
                treatmentRevenue.set(treatmentId, current)
            })
        })

        const topTreatments: ITreatmentRevenue[] = Array.from(treatmentRevenue.entries())
            .map(([treatmentId, data]) => ({
                treatmentId,
                treatmentName: treatmentMap.get(treatmentId)?.description || 'Tratamiento',
                revenue: data.revenue,
                count: data.count,
            }))
            .sort((left, right) => right.revenue - left.revenue)
            .slice(0, 10)

        const allPatientBalances = buildPatientBalances(currentRelevantBalanceDetails, patientMap)
            .filter(patient => matchesPatientSearch(
                `${patient.patientName} ${patient.nationalId} ${patient.contact}`
            ))
            .sort((left, right) => right.pending - left.pending)

        const topPatients = allPatientBalances
            .filter(patient => patient.pending > 0)
            .slice(0, 10)

        const startIndex = (pageNum - 1) * pageSizeNum
        const paginatedBalances = allPatientBalances.slice(startIndex, startIndex + pageSizeNum)

        const consultationsData: IConsultationRow[] = currentConsultations
            .map(consultation => {
                const patient = patientMap.get(consultation.patientId?.toString() || '')
                const balance = balances.find(balance => {
                    return balance.patientId?.toString() === consultation.patientId?.toString()
                })
                const paid = balance
                    ? calculatePaidForConsultation(
                        consultation._id.toString(),
                        balance.balanceDetails || []
                    )
                    : 0

                return {
                    consultationId: consultation._id.toString(),
                    date: consultation.createdAt || new Date(),
                    patientName: patient
                        ? getFullName(patient.firstName, patient.middleName, patient.lastName)
                        : 'Paciente desconocido',
                    patientId: consultation.patientId?.toString() || '',
                    total: consultation.total || 0,
                    paid,
                    due: Math.max((consultation.total || 0) - paid, 0),
                    treatmentsCount: consultation.consultationDetails?.length || 0,
                    status: consultation.status,
                    doctorName: consultation.doctorName,
                    siteName: consultation.siteName,
                }
            })
            .filter(consultation => matchesPatientSearch(consultation.patientName))
            .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
            .slice(0, 50)

        const totalQuoted = quotations.reduce((sum, quotation) => sum + (quotation.total || 0), 0)
        const quotationsCount = quotations.length
        const quotationsByPatient = new Map<string, any[]>()
        quotations.forEach(quotation => {
            const patientId = quotation.patientId?.toString()
            if (!patientId) return

            const current = quotationsByPatient.get(patientId) || []
            current.push(quotation)
            quotationsByPatient.set(patientId, current)
        })

        let convertedAmount = 0
        const convertedPatients = new Set<string>()
        currentConsultations.forEach(consultation => {
            const patientId = consultation.patientId?.toString()
            if (!patientId || !quotationsByPatient.has(patientId) || convertedPatients.has(patientId)) return

            const patientQuotations = quotationsByPatient.get(patientId) || []
            const consultationDate = new Date(consultation.createdAt || new Date())
            const hasPreviousQuotation = patientQuotations.some(quotation => {
                const quotationDate = new Date(quotation.createdAt || quotation.updatedAt || new Date())
                return quotationDate <= consultationDate
            })

            if (hasPreviousQuotation) {
                convertedPatients.add(patientId)
                convertedAmount += consultation.total || 0
            }
        })

        const quotationFunnel = {
            totalQuoted,
            convertedAmount,
            conversionRate: quotationsCount > 0 ? (convertedPatients.size / quotationsCount) * 100 : 0,
            quotationsCount,
            convertedCount: convertedPatients.size,
        }

        const over90DaysBucket = arAging.find(bucket => bucket.range === '>90 days')
        const warningStatuses = appointmentStatus.reduce((count, metric) => {
            if (metric.status === 'cancelada' || metric.status === 'no_asistio') {
                return count + metric.count
            }

            return count
        }, 0)

        const alerts = {
            total: warningStatuses + allPatientBalances.filter(patient => {
                return patient.status === 'Vencido' || patient.status === 'Crítico'
            }).length,
            pendingCollections: kpis.pendingCollectionsCount,
            overdueOver90Days: over90DaysBucket?.count || 0,
        }

        const reportsData: IReportsData = {
            kpis,
            comparisons,
            alerts,
            ageMix,
            appointmentStatus,
            availableFilters: {
                sites: Array.from(new Set(allConsultations.map(consultation => consultation.siteName))).sort((a, b) => a.localeCompare(b)),
                doctors: Array.from(new Set(allConsultations.map(consultation => consultation.doctorName))).sort((a, b) => a.localeCompare(b)),
                statuses: CONSULTATION_STATUS_OPTIONS,
            },
            revenueTrend,
            arAging,
            topTreatments,
            topPatients,
            patientBalances: {
                data: paginatedBalances,
                total: allPatientBalances.length,
                page: pageNum,
                pageSize: pageSizeNum,
            },
            consultations: consultationsData,
            quotationFunnel,
        }

        return res.status(200).json({
            data: reportsData,
            message: 'Reports data retrieved successfully',
            success: true,
        })
    } catch (error) {
        console.error('Error fetching reports data:', error)

        return res.status(500).json({
            message: 'Error fetching reports data',
            success: false,
        })
    } finally {
        await db.disconnect()
    }
}
