import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import { ApiResponse } from '@/interfaces'
import Treatment from '@/models/Treatment'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getTreatmentById(req, res)
        case 'PUT':
            return updateTreatmentById(req, res)

        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }
}

async function getTreatmentById(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
    const {
        query: { id },
    } = req

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID de la enfermedad es requerido y debe ser válido',
        })
    }

    await db.connect()

    try {
        const treatment = await Treatment.findById(id).lean()

        if (!treatment) {
            return res.status(404).json({
                ok: false,
                message: 'Tratamiento no encontrado',
            })
        }

        await db.disconnect()
        return res.status(200).json({
            ok: true,
            data: cleanResponse(treatment, true),
            message: 'Tratamiento encontrado exitosamente',
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

async function updateTreatmentById(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
    const {
        query: { id },
    } = req

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del tratamiento es requerido y debe ser válido',
        })
    }

    await db.connect()

    try {
        const updatedDisease = await Treatment.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).lean()
        await db.disconnect()
        if (!updatedDisease) {
            return res.status(404).json({
                ok: false,
                message: 'Tratamiento no encontrado',
            })
        }
        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedDisease, true),
            message: 'Tratamiento encontrado exitosamente',
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

