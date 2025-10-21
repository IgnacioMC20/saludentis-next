import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { dbOdontogram } from '@/database'
import { ApiResponse, ITeethState } from '@/interfaces'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'PUT':
            return updateOdontogram(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

/**
 * PUT /api/odontogram/[id]
 * Update current state of odontogram (auto-save endpoint)
 */
async function updateOdontogram(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { id } = req.query
    const { currentState, userId, consultationId } = req.body as {
        currentState: ITeethState;
        userId?: string;
        consultationId?: string;
    }

    // Validate odontogram ID
    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del odontograma es requerido',
        })
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del odontograma no es válido',
        })
    }

    // Validate current state
    if (!currentState || !currentState.teeth) {
        return res.status(400).json({
            ok: false,
            message: 'El estado actual del odontograma es requerido',
        })
    }

    // Validate teeth array
    if (!Array.isArray(currentState.teeth) || currentState.teeth.length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'El estado actual debe contener al menos un diente',
        })
    }

    // Validate userId if provided
    if (userId && !mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del usuario no es válido',
        })
    }

    // Validate consultationId if provided
    if (consultationId && !mongoose.isValidObjectId(consultationId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID de la consulta no es válido',
        })
    }

    try {
        const updatedOdontogram = await dbOdontogram.updateOdontogramCurrentState(
            id,
            currentState,
            userId,
            consultationId
        )

        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedOdontogram, true),
            message: 'Odontograma actualizado exitosamente',
        })
    } catch (error: any) {
        console.error('Error updating odontogram:', error)

        if (error.message === 'Odontogram not found') {
            return res.status(404).json({
                ok: false,
                message: 'Odontograma no encontrado',
            })
        }

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}