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
        
        case 'POST':
            return registerPayment(req, res)

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

const registerPayment = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query
    const { amount } = req.body

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID no es válido',
            success: false
        })
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            message: 'El monto del pago debe ser un número mayor a 0',
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

        if (amount > balance.balance!) {
            return res.status(400).json({
                message: 'El monto del pago no puede ser mayor al saldo actual',
                success: false
            })
        }

        // Update balance
        balance.balance = (balance.balance || 0) - amount

        // Find the most recent unpaid or partially paid consultation
        if (balance.balanceDetails && balance.balanceDetails.length > 0) {
            // Sort by most recent first
            const sortedDetails = [...balance.balanceDetails].sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return dateB - dateA
            })

            let remainingAmount = amount

            // Apply payment to consultations starting from the oldest unpaid
            for (let i = sortedDetails.length - 1; i >= 0 && remainingAmount > 0; i--) {
                const detail = sortedDetails[i]
                const unpaidAmount = (detail.total || 0) - (detail.amount || 0)

                if (unpaidAmount > 0) {
                    const paymentForThis = Math.min(remainingAmount, unpaidAmount)
                    detail.amount = (detail.amount || 0) + paymentForThis
                    detail.updatedAt = new Date()
                    remainingAmount -= paymentForThis
                }
            }
        }

        await balance.save()
        await db.disconnect()

        return res.status(200).json({
            balance,
            message: 'Pago registrado correctamente',
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
