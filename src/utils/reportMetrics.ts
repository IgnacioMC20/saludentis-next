import { format, startOfDay, startOfWeek, startOfMonth, differenceInDays } from 'date-fns';

import { IConsultation } from '@/models/Consultation';
import { IBalance, IBalanceDetail } from '@/models/Balance';
import { IPatient } from '@/interfaces';
import { IRevenueDataPoint, IARAgingBucket } from '@/interfaces/reports';

/**
 * Group consultations by date period (day/week/month)
 */
export const groupByPeriod = (
    date: Date,
    groupBy: 'day' | 'week' | 'month'
): string => {
    const d = new Date(date);
    switch (groupBy) {
        case 'day':
            return format(startOfDay(d), 'yyyy-MM-dd');
        case 'week':
            return format(startOfWeek(d), 'yyyy-MM-dd');
        case 'month':
            return format(startOfMonth(d), 'yyyy-MM');
        default:
            return format(startOfDay(d), 'yyyy-MM-dd');
    }
};

/**
 * Calculate total revenue from consultations
 */
export const calculateTotalRevenue = (
    consultations: IConsultation[]
): number => {
    return consultations.reduce((sum, consultation) => {
        return sum + (consultation.total || 0);
    }, 0);
};

/**
 * Calculate collected payments from balance details
 */
export const calculateCollectedPayments = (
    balances: IBalance[]
): number => {
    return balances.reduce((sum, balance) => {
        const detailsSum = (balance.balanceDetails || []).reduce((detailSum, detail) => {
            return detailSum + (detail.amount || 0);
        }, 0);
        return sum + detailsSum;
    }, 0);
};

/**
 * Calculate outstanding balances (A/R)
 */
export const calculateOutstandingBalances = (
    balances: IBalance[]
): number => {
    return balances.reduce((sum, balance) => {
        return sum + (balance.balance || 0);
    }, 0);
};

/**
 * Calculate pending collections (total - paid)
 */
export const calculatePendingCollections = (
    balances: IBalance[]
): number => {
    return balances.reduce((sum, balance) => {
        const detailsSum = (balance.balanceDetails || []).reduce((detailSum, detail) => {
            const pending = (detail.total || 0) - (detail.amount || 0);
            return detailSum + pending;
        }, 0);
        return sum + detailsSum;
    }, 0);
};

/**
 * Group revenue by period
 */
export const groupRevenueByPeriod = (
    consultations: IConsultation[],
    balances: IBalance[],
    groupBy: 'day' | 'week' | 'month'
): IRevenueDataPoint[] => {
    const revenueMap = new Map<string, { revenue: number; collections: number }>();

    // Group consultations (revenue)
    consultations.forEach(consultation => {
        if (consultation.createdAt) {
            const period = groupByPeriod(consultation.createdAt, groupBy);
            const current = revenueMap.get(period) || { revenue: 0, collections: 0 };
            current.revenue += consultation.total || 0;
            revenueMap.set(period, current);
        }
    });

    // Group payments (collections)
    balances.forEach(balance => {
        (balance.balanceDetails || []).forEach(detail => {
            if (detail.createdAt) {
                const period = groupByPeriod(detail.createdAt, groupBy);
                const current = revenueMap.get(period) || { revenue: 0, collections: 0 };
                current.collections += detail.amount || 0;
                revenueMap.set(period, current);
            }
        });
    });

    // Convert to array and sort by date
    return Array.from(revenueMap.entries())
        .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            collections: data.collections
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Calculate A/R aging buckets
 */
export const calculateARAgingBuckets = (
    balances: IBalance[],
    patients: Map<string, IPatient>
): IARAgingBucket[] => {
    const buckets: IARAgingBucket[] = [
        { range: '0-30 days', count: 0, amount: 0, patients: [] },
        { range: '31-60 days', count: 0, amount: 0, patients: [] },
        { range: '61-90 days', count: 0, amount: 0, patients: [] },
        { range: '>90 days', count: 0, amount: 0, patients: [] }
    ];

    const now = new Date();

    balances.forEach(balance => {
        if ((balance.balance || 0) > 0 && balance.balanceDetails && balance.balanceDetails.length > 0) {
            // Find oldest unpaid detail
            const oldestUnpaid = balance.balanceDetails
                .filter(detail => (detail.total || 0) > (detail.amount || 0))
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateA - dateB;
                })[0];

            if (oldestUnpaid && oldestUnpaid.createdAt) {
                const daysPast = differenceInDays(now, new Date(oldestUnpaid.createdAt));
                const patientId = balance.patientId?.toString() || '';
                const patient = patients.get(patientId);
                const patientName = patient 
                    ? `${patient.firstName} ${patient.lastName}`.trim()
                    : 'Unknown';

                let bucketIndex = 0;
                if (daysPast > 90) bucketIndex = 3;
                else if (daysPast > 60) bucketIndex = 2;
                else if (daysPast > 30) bucketIndex = 1;

                buckets[bucketIndex].count++;
                buckets[bucketIndex].amount += balance.balance || 0;
                buckets[bucketIndex].patients.push(patientName);
            }
        }
    });

    return buckets;
};

/**
 * Calculate paid amount for a specific consultation using FIFO
 */
export const calculatePaidForConsultation = (
    consultationId: string,
    balanceDetails: IBalanceDetail[]
): number => {
    const detail = balanceDetails.find(
        d => d.consultationId?.toString() === consultationId
    );
    return detail?.amount || 0;
};

/**
 * Format currency for Guatemala (GTQ)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), 'dd/MM/yyyy');
    } catch {
        return 'N/A';
    }
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A';
    try {
        return format(new Date(date), 'dd/MM/yyyy HH:mm');
    } catch {
        return 'N/A';
    }
};