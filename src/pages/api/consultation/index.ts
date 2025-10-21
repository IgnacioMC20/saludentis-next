import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Balance from '@/models/Balance'
import Consultation, { IConsultation } from '@/models/Consultation'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'POST':
            return createConsultation(req, res)
        case 'GET':
            return getConsultations(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

async function createConsultation(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const consultationData = req.body as IConsultation

    // Validate required fields
    if (!consultationData.patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(consultationData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    // Validate consultation details if provided
    if (consultationData.consultationDetails && consultationData.consultationDetails.length > 0) {
        for (const detail of consultationData.consultationDetails) {
            if (detail.treatmentId && !mongoose.isValidObjectId(detail.treatmentId)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El ID del tratamiento no es válido',
                })
            }
            if (detail.diseaseId && !mongoose.isValidObjectId(detail.diseaseId)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El ID de la enfermedad no es válido',
                })
            }
        }
    }

    await db.connect()

    try {
        const newConsultation = new Consultation(consultationData)
        await newConsultation.save()

        // Update or create balance for the patient
        const patientId = consultationData.patientId
        const consultationTotal = consultationData.total || 0

        // Find existing balance or create new one
        let balance = await Balance.findOne({ patientId })

        if (!balance) {
            // Create new balance if it doesn't exist
            balance = new Balance({
                patientId,
                balance: consultationTotal,
                balanceDetails: [{
                    consultationId: newConsultation._id,
                    amount: 0,
                    total: consultationTotal,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }]
            })
        } else {
            // Update existing balance
            balance.balance = (balance.balance || 0) + consultationTotal
            balance.balanceDetails = balance.balanceDetails || []
            balance.balanceDetails.push({
                consultationId: newConsultation._id,
                amount: 0,
                total: consultationTotal,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        await balance.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: newConsultation,
            message: 'Consulta creada exitosamente',
        })
    } catch (error: any) {
        console.error(error)

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function getConsultations(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { patientId } = req.query

    // If patientId is provided, validate it
    if (patientId && !mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        let consultations

        // If patientId is provided, filter by patientId
        if (patientId) {
            consultations = await Consultation.find({ patientId })
                .populate('patientId', 'firstName lastName nationalId')
                .lean()
        } else {
            consultations = await Consultation.find()
                .populate('patientId', 'firstName lastName nationalId')
                .lean()
        }

        await db.disconnect()

        if (!consultations || consultations.length === 0) {
            return res.status(404).json({
                ok: false,
                data: [],
                message: 'No se encontraron consultas',
            })
        }

        return res.status(200).json({
            ok: true,
            data: cleanResponse(consultations, true),
        })
    } catch (error: any) {
        console.error(error)

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}
