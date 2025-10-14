import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import Balance, { IBalance } from '@/models/Balance'

type Data =
    | { message: string, success: boolean }
    | {
        balance: IBalance;
        message: string;
        success: boolean;
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getBalanceByPatientId(req, res)

        case 'PUT':
            return addPayment(req, res)

        default:
            return res.status(400).json({ message: 'Bad request', success: false })
    }
}

const getBalanceByPatientId = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID no es válido',
            success: false
        })
    }

    try {
        await db.connect()

        // Find balance by patient ID
        const balance = await Balance.findOne({ patientId: id })

        if (!balance) {
            return res.status(404).json({
                message: 'Saldo no encontrado',
                success: false
            })
        }

        await db.disconnect()

        return res.status(200).json({
            balance,
            message: 'Saldo encontrado correctamente',
            success: true
        })

    } catch (error) {
        console.error('Error al obtener el balance:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al obtener el balance',
            success: false
        })
    }
}

const addPayment = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query
    const { amount } = req.body

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID no es válido',
            success: false
        })
    }

    if (!amount || Number(amount) <= 0) {
        return res.status(400).json({
            message: 'El monto del pago debe ser mayor a 0',
            success: false
        })
    }

    try {
        await db.connect()

        // Find balance by patient ID
        const balance = await Balance.findOne({ patientId: id })

        if (!balance) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Saldo no encontrado',
                success: false
            })
        }

        // Subtract the payment amount from the balance
        balance.balance = (balance.balance || 0) - Number(amount)

        // Find the oldest unpaid or partially paid consultation and apply payment
        if (balance.balanceDetails && balance.balanceDetails.length > 0) {
            let remainingPayment = Number(amount)

            for (const detail of balance.balanceDetails) {
                if (remainingPayment <= 0) break

                const unpaidAmount = (detail.total || 0) - (detail.amount || 0)
                if (unpaidAmount > 0) {
                    const paymentToApply = Math.min(remainingPayment, unpaidAmount)
                    detail.amount = (detail.amount || 0) + paymentToApply
                    detail.updatedAt = new Date()
                    remainingPayment -= paymentToApply
                }
            }
        }

        await balance.save()
        await db.disconnect()

        return res.status(200).json({
            balance,
            message: 'Pago registrado exitosamente',
            success: true
        })

    } catch (error) {
        console.error('Error al registrar el pago:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al registrar el pago',
            success: false
        })
    }
}
