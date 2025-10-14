import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Diet, { IDiet } from '@/models/Diet'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getDietByPatientId(req, res)
        case 'POST':
            return createDiet(req, res)
        case 'PUT':
            return updateDiet(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

async function getDietByPatientId(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
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
        const diet = await Diet.findOne({ patientId: id }).lean()

        await db.disconnect()

        if (!diet) {
            return res.status(200).json({
                ok: true,
                data: null,
                message: 'No se encontró información de dieta para este paciente',
            })
        }

        return res.status(200).json({
            ok: true,
            data: cleanResponse(diet, true),
            message: 'Información de dieta encontrada exitosamente',
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

async function createDiet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const dietData = req.body as IDiet


    // Validate required fields
    if (!dietData.patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(dietData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        // Check if diet already exists for this patient
        const existingDiet = await Diet.findOne({ patientId: dietData.patientId })

        if (existingDiet) {
            await db.disconnect()
            return res.status(400).json({
                ok: false,
                message: 'Ya existe información de dieta para este paciente. Use PUT para actualizar.',
            })
        }

        const newDiet = new Diet(dietData)
        await newDiet.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: cleanResponse(newDiet.toObject()),
            message: 'Información de dieta creada exitosamente',
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

async function updateDiet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        query: { id },
    } = req
    const dietData = req.body as Partial<IDiet>


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
        const updatedDiet = await Diet.findOneAndUpdate(
            { patientId: id },
            {
                $set: {
                    organSystems: dietData.organSystems,
                    dietNotes: dietData.dietNotes,
                    moodNotes: dietData.moodNotes,
                    physicalActivityNotes: dietData.physicalActivityNotes,
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedDiet) {
            await db.disconnect()
            return res.status(404).json({
                ok: false,
                message: 'Información de dieta no encontrada',
            })
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedDiet.toObject()),
            message: 'Información de dieta actualizada exitosamente',
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