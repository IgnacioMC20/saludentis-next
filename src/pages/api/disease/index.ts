import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database' // Asegúrate de que tengas tu conexión a la base de datos aquí
import { seedDisieases } from '@/database/seedDB'
import { ApiResponse } from '@/interfaces'
import Disease from '@/models/Disease'

export default async function seedHandler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method === 'POST') {
        return createDisease(req, res)
    }

    try {
        await Disease.deleteMany()
        await Disease.insertMany(seedDisieases)
        await db.connect()
        const diseases = await Disease.find().lean()
        await db.disconnect()

        if (!diseases.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron datos',
            })
        }

        return res.status(201).json({
            ok: true,
            message: 'Enfermedades encontradas exitosamente',
            data: cleanResponse(diseases)
        })
    } catch (error: any) {
        console.error(error)
        await db.disconnect()
        return res.status(500).json({
            ok: false,
            message: 'Un error ocurrio al crear la seed data',
            errors: error.message,
        })
    }
}

async function createDisease(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        body: diseaseData
    } = req

    if (!diseaseData || !diseaseData.detail) {
        return res.status(400).json({
            ok: false,
            message: 'Los detelles de la enfermedad son requeridos',
        })
    }

    try {
        await db.connect()

        const newDisease = new Disease({
            ...diseaseData
        })

        await newDisease.save()
        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: cleanResponse(newDisease.toObject(), true),
            message: 'Enfermedad creada exitosamente',
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
