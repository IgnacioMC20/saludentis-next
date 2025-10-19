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
