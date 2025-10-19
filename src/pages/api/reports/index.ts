import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { IReportsData } from '@/interfaces/reports'
import Balance from '@/models/Balance'
import Consultation from '@/models/Consultation'
import Patient from '@/models/Patient'
import Quotation from '@/models/Quotation'
import {
    calculateTotalRevenue,
    calculateCollectedPayments,
    calculateOutstandingBalances,
    calculatePendingCollections,
    groupRevenueByPeriod,
    calculateARAgingBuckets,
} from '@/utils/reportMetrics'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<IReportsData>>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, message: 'Method not allowed' })
    }

    const {
        startDate,
        endDate,
        groupBy = 'month',
        page = '1',
        pageSize = '10',
    } = req.query

    if (!startDate || !endDate) {
        return res.status(400).json({
            ok: false,
            message: 'startDate and endDate are required',
        })
    }

    await db.connect()

    try {
        const start = new Date(startDate as string)
        const end = new Date(endDate as string)

        // Fetch data
        const consultations = await Consultation.find({
            createdAt: { $gte: start, $lte: end },
        }).lean()

        const balances = await Balance.find().lean()
        const patients = await Patient.find().lean()
        const quotations = await Quotation.find({
            createdAt: { $gte: start, $lte: end },
        }).lean()

        // Create patient map for quick lookup
        const patientMap = new Map(patients.map(p => [p._id.toString(), p]))

        // Calculate KPIs
        const totalRevenue = calculateTotalRevenue(consultations)
        const collectedPayments = calculateCollectedPayments(balances)
        const outstandingBalances = calculateOutstandingBalances(balances)
        const pendingCollections = calculatePendingCollections(balances)
        const consultationsCount = consultations.length
        const patientsSeen = new Set(consultations.map(c => c.patientId?.toString())).size
        const newPatients = patients.filter(
            p => p.createdAt && p.createdAt >= start && p.createdAt <= end
        ).length

        // Calculate revenue trend
        const revenueTrend = groupRevenueByPeriod(
            consultations,
            balances,
            groupBy as 'day' | 'week' | 'month'
        )

        // Calculate A/R aging
        const arAging = calculateARAgingBuckets(balances, patientMap)

        // Prepare response
        const reportsData: IReportsData = {
            kpis: {
                totalRevenue,
                collectedPayments,
                outstandingBalances,
                pendingCollections,
                consultationsCount,
                patientsSeen,
                newPatients,
            },
            revenueTrend,
            arAging,
            topTreatments: [],
            topPatients: [],
            patientBalances: {
                data: [],
                total: 0,
                page: parseInt(page as string),
                pageSize: parseInt(pageSize as string),
            },
            consultations: [],
            quotationFunnel: {
                totalQuoted: quotations.reduce((sum, q) => sum + (q.total || 0), 0),
                convertedAmount: 0,
                conversionRate: 0,
                quotationsCount: quotations.length,
                convertedCount: 0,
            },
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: reportsData,
        })
    } catch (error: any) {
        console.error('Reports API Error:', error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Internal server error',
            errors: error,
        })
    }
}