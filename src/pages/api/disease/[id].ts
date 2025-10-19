import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import { ApiResponse } from '@/interfaces'
import Disease from '@/models/Disease'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getDiseaseById(req, res)

        // TODO: Implement POST method
        case 'PUT':
            return updateDiseaseById(req, res)
        case 'POST':
            return res.status(405).json({ ok: false, message: 'Method not allowed' })

        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }
}

async function getDiseaseById(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
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
        const disease = await Disease.findById(id).lean()

        if (!disease) {
            return res.status(404).json({
                ok: false,
                message: 'Enfermedad no encontrada',
            })
        }

        await db.disconnect()
        return res.status(200).json({
            ok: true,
            data: cleanResponse(disease, true),
            message: 'Enfermedad encontrada exitosamente',
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
async function updateDiseaseById(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
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
        const updatedDisease = await Disease.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        }).lean()
        await db.disconnect()
        if (!updatedDisease) {
            return res.status(404).json({
                ok: false,
                message: 'Enfermedad no encontrada',
            })
        }
        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedDisease, true),
            message: 'Enfermedad encontrada exitosamente',
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

