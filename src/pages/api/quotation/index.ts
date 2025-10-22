import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Quotation, { IQuotation } from '@/models/Quotation'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'POST':
            return createQuotation(req, res)
        case 'GET':
            return getQuotations(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

async function createQuotation(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const quotationData = req.body as IQuotation

    // Validate required fields
    if (!quotationData.patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(quotationData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    // Validate quotation details if provided
    if (!quotationData.quotationDetails || quotationData.quotationDetails.length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'Debe agregar al menos un tratamiento a la cotización',
        })
    }

    // Validate ObjectIds in quotation details
    for (const detail of quotationData.quotationDetails) {
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

    await db.connect()

    try {
        const newQuotation = new Quotation(quotationData)
        await newQuotation.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: newQuotation,
            message: 'Cotización creada exitosamente',
        })
    } catch (error: any) {
        console.error('Error creating quotation:', error)

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function getQuotations(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
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
        let quotations

        // If patientId is provided, filter by patientId
        if (patientId) {
            quotations = await Quotation.find({ patientId })
                .populate('patientId', 'firstName lastName nationalId')
                .populate('quotationDetails.treatmentId', 'description price')
                .populate('quotationDetails.diseaseId', 'detail')
                .lean()
        } else {
            quotations = await Quotation.find()
                .populate('patientId', 'firstName lastName nationalId')
                .populate('quotationDetails.treatmentId', 'description price')
                .populate('quotationDetails.diseaseId', 'detail')
                .lean()
        }

        await db.disconnect()

        if (!quotations || quotations.length === 0) {
            return res.status(404).json({
                ok: false,
                data: [],
                message: 'No se encontraron cotizaciones',
            })
        }

        return res.status(200).json({
            ok: true,
            data: cleanResponse(quotations, false), // false = NO eliminar timestamps
        })
    } catch (error: any) {
        console.error('Error fetching quotations:', error)

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}