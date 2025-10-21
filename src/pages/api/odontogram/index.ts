import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { dbOdontogram } from '@/database'
import { ApiResponse, IOdontogram } from '@/interfaces'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getOdontogram(req, res)
        case 'POST':
            return createOdontogram(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

/**
 * GET /api/odontogram?patientId={id}
 * Fetch odontogram for a patient (creates default if doesn't exist)
 */
async function getOdontogram(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { patientId } = req.query

    if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    try {
        const odontogram = await dbOdontogram.getOrCreateOdontogram(patientId)

        return res.status(200).json({
            ok: true,
            data: cleanResponse(odontogram, true),
            message: 'Odontograma obtenido exitosamente',
        })
    } catch (error: any) {
        console.error('Error fetching odontogram:', error)

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

/**
 * POST /api/odontogram
 * Create new odontogram for a patient
 */
async function createOdontogram(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { patientId, dentalArchType } = req.body as Partial<IOdontogram>

    // Validate required fields
    if (!patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    // Validate dental arch type
    if (dentalArchType && !['adult', 'child'].includes(dentalArchType)) {
        return res.status(400).json({
            ok: false,
            message: 'El tipo de arcada dental debe ser "adult" o "child"',
        })
    }

    try {
        const odontogram = await dbOdontogram.getOrCreateOdontogram(
            patientId as string,
            dentalArchType || 'adult'
        )

        return res.status(201).json({
            ok: true,
            data: cleanResponse(odontogram, true),
            message: 'Odontograma creado exitosamente',
        })
    } catch (error: any) {
        console.error('Error creating odontogram:', error)

        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                message: 'Ya existe un odontograma para este paciente',
            })
        }

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}