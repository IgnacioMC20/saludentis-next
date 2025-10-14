import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Background, { IBackground } from '@/models/Background'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getBackgroundByPatientId(req, res)
        case 'POST':
            return createBackground(req, res)
        case 'PUT':
            return updateBackground(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

async function getBackgroundByPatientId(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        query: { id },
    } = req


    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido y debe ser válido',
        })
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        const background = await Background.findOne({ patientId: id }).lean()

        await db.disconnect()

        if (!background) {
            return res.status(200).json({
                ok: true,
                data: null,
                message: 'No se encontró historial clínico para este paciente',
            })
        }

        return res.status(200).json({
            ok: true,
            data: cleanResponse(background, true),
            message: 'Historial clínico encontrado exitosamente',
        })
    } catch (error: any) {

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function createBackground(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const backgroundData = req.body as IBackground


    // Validate required fields
    if (!backgroundData.patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(backgroundData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        // Check if background already exists for this patient
        const existingBackground = await Background.findOne({ patientId: backgroundData.patientId })

        if (existingBackground) {
            await db.disconnect()
            return res.status(400).json({
                ok: false,
                message: 'Ya existe un historial clínico para este paciente. Use PUT para actualizar.',
            })
        }

        const newBackground = new Background(backgroundData)
        await newBackground.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: cleanResponse(newBackground.toObject()),
            message: 'Historial clínico creado exitosamente',
        })
    } catch (error: any) {

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function updateBackground(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        query: { id },
    } = req
    const backgroundData = req.body as Partial<IBackground>


    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido y debe ser válido',
        })
    }

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        const updatedBackground = await Background.findOneAndUpdate(
            { patientId: id },
            {
                $set: {
                    medicalHistory: backgroundData.medicalHistory,
                    familyHistory: backgroundData.familyHistory,
                    dentalHistory: backgroundData.dentalHistory,
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedBackground) {
            await db.disconnect()
            return res.status(404).json({
                ok: false,
                message: 'Historial clínico no encontrado',
            })
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedBackground.toObject()),
            message: 'Historial clínico actualizado exitosamente',
        })
    } catch (error: any) {

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}