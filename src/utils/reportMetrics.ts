import {
    differenceInCalendarDays,
    differenceInDays,
    format,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays,
} from 'date-fns'

import { IPatient } from '@/interfaces'
import {
    CONSULTATION_STATUS_LABELS,
    IAgeMixMetrics,
    IAppointmentStatusMetric,
    IARAgingBucket,
    IMetricComparison,
    IRevenueDataPoint,
    ConsultationStatus,
} from '@/interfaces/reports'
import { IBalance, IBalanceDetail } from '@/models/Balance'
import { IConsultation } from '@/models/Consultation'

/**
 * Group consultations by date period (day/week/month)
 */
export const groupByPeriod = (
    date: Date,
    groupBy: 'day' | 'week' | 'month'
): string => {
    const d = new Date(date)
    switch (groupBy) {
        case 'day':
            return format(startOfDay(d), 'yyyy-MM-dd')
        case 'week':
            return format(startOfWeek(d), 'yyyy-MM-dd')
        case 'month':
            return format(startOfMonth(d), 'yyyy-MM')
        default:
            return format(startOfDay(d), 'yyyy-MM-dd')
    }
}

/**
 * Calculate total revenue from consultations
 */
export const calculateTotalRevenue = (
    consultations: IConsultation[]
): number => {
    return consultations.reduce((sum, consultation) => {
        return sum + (consultation.total || 0)
    }, 0)
}

/**
 * Calculate collected payments from balance details
 */
export const calculateCollectedPayments = (
    balances: IBalance[],
    consultationIds?: Set<string>
): number => {
    return balances.reduce((sum, balance) => {
        const detailsSum = (balance.balanceDetails || []).reduce((detailSum, detail) => {
            if (consultationIds) {
                const consultationId = detail.consultationId?.toString()
                if (!consultationId || !consultationIds.has(consultationId)) return detailSum
            }
            return detailSum + (detail.amount || 0)
        }, 0)
        return sum + detailsSum
    }, 0)
}

/**
 * Calculate outstanding balances (A/R)
 */
export const calculateOutstandingBalances = (
    balances: IBalance[],
    consultationIds?: Set<string>
): number => {
    if (!consultationIds) {
        return balances.reduce((sum, balance) => {
            return sum + (balance.balance || 0)
        }, 0)
    }

    return balances.reduce((sum, balance) => {
        const pending = (balance.balanceDetails || []).reduce((detailSum, detail) => {
            const consultationId = detail.consultationId?.toString()
            if (!consultationId || !consultationIds.has(consultationId)) return detailSum
            return detailSum + Math.max((detail.total || 0) - (detail.amount || 0), 0)
        }, 0)
        return sum + pending
    }, 0)
}

/**
 * Calculate pending collections (total - paid)
 */
export const calculatePendingCollections = (
    balances: IBalance[],
    consultationIds?: Set<string>
): number => {
    return balances.reduce((sum, balance) => {
        const detailsSum = (balance.balanceDetails || []).reduce((detailSum, detail) => {
            if (consultationIds) {
                const consultationId = detail.consultationId?.toString()
                if (!consultationId || !consultationIds.has(consultationId)) return detailSum
            }
            const pending = (detail.total || 0) - (detail.amount || 0)
            return detailSum + pending
        }, 0)
        return sum + detailsSum
    }, 0)
}

export const calculatePendingCollectionsCount = (
    balances: IBalance[],
    consultationIds?: Set<string>
): number => {
    return balances.reduce((sum, balance) => {
        const count = (balance.balanceDetails || []).reduce((detailCount, detail) => {
            if (consultationIds) {
                const consultationId = detail.consultationId?.toString()
                if (!consultationId || !consultationIds.has(consultationId)) return detailCount
            }

            return ((detail.total || 0) > (detail.amount || 0)) ? detailCount + 1 : detailCount
        }, 0)

        return sum + count
    }, 0)
}

/**
 * Group revenue by period
 */
export const groupRevenueByPeriod = (
    consultations: IConsultation[],
    balances: IBalance[],
    groupBy: 'day' | 'week' | 'month',
    consultationIds?: Set<string>
): IRevenueDataPoint[] => {
    const revenueMap = new Map<string, { revenue: number; collections: number }>()

    // Group consultations (revenue)
    consultations.forEach(consultation => {
        if (consultationIds && !consultationIds.has((consultation as any)._id?.toString?.() || '')) return
        if (consultation.createdAt) {
            const period = groupByPeriod(consultation.createdAt, groupBy)
            const current = revenueMap.get(period) || { revenue: 0, collections: 0 }
            current.revenue += consultation.total || 0
            revenueMap.set(period, current)
        }
    })

    // Group payments (collections)
    balances.forEach(balance => {
        (balance.balanceDetails || []).forEach(detail => {
            const consultationId = detail.consultationId?.toString()
            if (consultationIds && (!consultationId || !consultationIds.has(consultationId))) return
            if (detail.createdAt) {
                const period = groupByPeriod(detail.createdAt, groupBy)
                const current = revenueMap.get(period) || { revenue: 0, collections: 0 }
                current.collections += detail.amount || 0
                revenueMap.set(period, current)
            }
        })
    })

    // Convert to array and sort by date
    return Array.from(revenueMap.entries())
        .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            collections: data.collections
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Calculate A/R aging buckets
 */
export const calculateARAgingBuckets = (
    balances: IBalance[],
    patients: Map<string, IPatient>,
    consultationIds?: Set<string>
): IARAgingBucket[] => {
    const buckets: IARAgingBucket[] = [
        { range: '0-30 days', count: 0, amount: 0, patients: [] },
        { range: '31-60 days', count: 0, amount: 0, patients: [] },
        { range: '61-90 days', count: 0, amount: 0, patients: [] },
        { range: '>90 days', count: 0, amount: 0, patients: [] }
    ]

    const now = new Date()

    balances.forEach(balance => {
        const relevantDetails = (balance.balanceDetails || []).filter(detail => {
            if (consultationIds) {
                const consultationId = detail.consultationId?.toString()
                if (!consultationId || !consultationIds.has(consultationId)) return false
            }

            return (detail.total || 0) > (detail.amount || 0)
        })

        if (relevantDetails.length > 0) {
            // Find oldest unpaid detail
            const oldestUnpaid = relevantDetails
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                    return dateA - dateB
                })[0]

            if (oldestUnpaid && oldestUnpaid.createdAt) {
                const daysPast = differenceInDays(now, new Date(oldestUnpaid.createdAt))
                const patientId = balance.patientId?.toString() || ''
                const patient = patients.get(patientId)
                const patientName = patient 
                    ? `${patient.firstName} ${patient.lastName}`.trim()
                    : 'Unknown'

                let bucketIndex = 0
                if (daysPast > 90) bucketIndex = 3
                else if (daysPast > 60) bucketIndex = 2
                else if (daysPast > 30) bucketIndex = 1

                buckets[bucketIndex].count++
                buckets[bucketIndex].amount += relevantDetails.reduce((sum, detail) => {
                    return sum + Math.max((detail.total || 0) - (detail.amount || 0), 0)
                }, 0)
                buckets[bucketIndex].patients.push(patientName)
            }
        }
    })

    return buckets
}

/**
 * Calculate paid amount for a specific consultation using FIFO
 */
export const calculatePaidForConsultation = (
    consultationId: string,
    balanceDetails: IBalanceDetail[]
): number => {
    const detail = balanceDetails.find(
        d => d.consultationId?.toString() === consultationId
    )
    return detail?.amount || 0
}

export const normalizeConsultationStatus = (
    status?: string | null
): ConsultationStatus => {
    switch (status) {
        case 'confirmada':
        case 'completada':
        case 'cancelada':
        case 'no_asistio':
            return status
        default:
            return 'completada'
    }
}

export const getConsultationDefaults = (consultation: IConsultation) => ({
    status: normalizeConsultationStatus(consultation.status),
    doctorName: consultation.doctorName?.trim() || 'Sin asignar',
    siteName: consultation.siteName?.trim() || 'Principal',
})

export const getPreviousPeriodRange = (startDate: Date, endDate: Date) => {
    const rangeLength = Math.max(differenceInCalendarDays(endDate, startDate), 0) + 1
    const previousEnd = subDays(startDate, 1)
    const previousStart = subDays(previousEnd, rangeLength - 1)

    return { previousStart, previousEnd }
}

export const createMetricComparison = (
    current: number,
    previous: number,
    comparisonLabel: string
): IMetricComparison => {
    if (previous === 0 && current === 0) {
        return {
            current,
            previous,
            deltaPercent: 0,
            trend: 'neutral',
            comparisonLabel,
        }
    }

    if (previous === 0) {
        return {
            current,
            previous,
            deltaPercent: 100,
            trend: 'up',
            comparisonLabel,
        }
    }

    const deltaPercent = Number((((current - previous) / previous) * 100).toFixed(1))
    const trend = deltaPercent === 0 ? 'neutral' : deltaPercent > 0 ? 'up' : 'down'

    return {
        current,
        previous,
        deltaPercent,
        trend,
        comparisonLabel,
    }
}

export const calculateAgeMixMetrics = (patients: IPatient[]): IAgeMixMetrics => {
    const total = patients.length
    let adults = 0

    patients.forEach(patient => {
        if (!patient.birthDate) return

        const birthDate = new Date(patient.birthDate)
        if (isNaN(birthDate.getTime())) return

        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const hasBirthdayPassed =
            today.getMonth() > birthDate.getMonth()
            || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

        const adjustedAge = hasBirthdayPassed ? age : age - 1
        if (adjustedAge >= 18) adults++
    })

    const children = total - adults

    return {
        children,
        adults,
        total,
        childrenPercentage: total ? Number(((children / total) * 100).toFixed(1)) : 0,
        adultsPercentage: total ? Number(((adults / total) * 100).toFixed(1)) : 0,
    }
}

export const calculateAppointmentStatusMetrics = (
    consultations: Array<IConsultation & { status?: ConsultationStatus }>
): IAppointmentStatusMetric[] => {
    const total = consultations.length
    const counts = consultations.reduce<Record<ConsultationStatus, number>>((acc, consultation) => {
        const status = normalizeConsultationStatus(consultation.status)
        acc[status] += 1
        return acc
    }, {
        confirmada: 0,
        completada: 0,
        cancelada: 0,
        no_asistio: 0,
    })

    return Object.entries(counts).map(([status, count]) => ({
        status: status as ConsultationStatus,
        label: CONSULTATION_STATUS_LABELS[status as ConsultationStatus],
        count,
        percentage: total ? Number(((count / total) * 100).toFixed(1)) : 0,
    }))
}

export const getPatientBalanceStatus = (
    daysPastDue: number,
    pending: number
): 'Pendiente' | 'Vencido' | 'Crítico' | 'Al día' => {
    if (pending <= 0) return 'Al día'
    if (daysPastDue > 90) return 'Crítico'
    if (daysPastDue > 30) return 'Vencido'
    return 'Pendiente'
}

/**
 * Format currency for Guatemala (GTQ)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
        minimumFractionDigits: 2
    }).format(amount)
}

/**
 * Format date for display
 */
export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A'
    try {
        return format(new Date(date), 'dd/MM/yyyy')
    } catch {
        return 'N/A'
    }
}

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A'
    try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm')
    } catch {
        return 'N/A'
    }
}
