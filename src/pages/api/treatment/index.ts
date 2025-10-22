import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database' // Asegúrate de que tengas tu conexión a la base de datos aquí
import { seedTreatments } from '@/database/seedDB'
import { ApiResponse } from '@/interfaces'
import Treatment from '@/models/Treatment'

export default async function seedHandler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method === 'POST') {
        return createTreatment(req, res)
    }

    try {
        // await Treatment.deleteMany()
        // await Treatment.insertMany(seedTreatments)
        await db.connect()
        const treatments = await Treatment.find().lean()
        await db.disconnect()

        if (!treatments.length) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron datos de tratamientos',
            })
        }

        return res.status(201).json({
            ok: true,
            message: 'Tratamientos encontrados exitosamente',
            data: cleanResponse(treatments)
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

async function createTreatment(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        body: treatmentData
    } = req

    if (!treatmentData || !treatmentData.description || typeof Number(treatmentData.price) !== 'number') {
        return res.status(400).json({
            ok: false,
            message: 'La descripción y el precio del tratamiento son requeridos',
        })
    }

    try {

        await db.connect()

        const newTreatment = new Treatment({
            ...treatmentData
        })

        await newTreatment.save()
        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: cleanResponse(newTreatment.toObject(), true),
            message: 'Tratamiento creado exitosamente',
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
