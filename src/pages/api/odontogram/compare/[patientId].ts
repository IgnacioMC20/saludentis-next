import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { dbOdontogram } from '@/database'
import { ApiResponse } from '@/interfaces'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return compareOdontogramStates(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

/**
 * GET /api/odontogram/compare/[patientId]
 * Compare initial state vs current state for a patient's odontogram
 */
async function compareOdontogramStates(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
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
        const comparison = await dbOdontogram.compareOdontogramStates(patientId)

        return res.status(200).json({
            ok: true,
            data: cleanResponse(comparison, true),
            message: 'Comparación obtenida exitosamente',
        })
    } catch (error: any) {
        console.error('Error comparing odontogram states:', error)

        if (error.message === 'Odontogram not found for patient') {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró odontograma para este paciente',
            })
        }

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}