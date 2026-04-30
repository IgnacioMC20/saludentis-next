import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Patient from '@/models/Patient'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getPatientById(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }
}

export async function getPatientById(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        query: { id },
    } = req

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido y debe ser válido',
        })
    }

    await db.connect()

    try {
        const patient = await Patient.findById(id)

        if (!patient) {
            await db.disconnect()
            return res.status(404).json({
                ok: false,
                message: 'Paciente no encontrado',
            })
        }

        if (!patient.odontogramProfile) {
            const birth = patient.birthDate ? new Date(patient.birthDate) : null
            const created = patient.createdAt ? new Date(patient.createdAt) : null

            if (birth && created && !Number.isNaN(birth.getTime()) && !Number.isNaN(created.getTime())) {
                const age = created.getFullYear() - birth.getFullYear()
                const birthdayPassed =
                    created.getMonth() > birth.getMonth() ||
                    (created.getMonth() === birth.getMonth() && created.getDate() >= birth.getDate())

                patient.odontogramProfile = birthdayPassed ? (age >= 18 ? 'adult' : 'child') : (age - 1 >= 18 ? 'adult' : 'child')
                await patient.save()
            }
        }

        await db.disconnect()
        return res.status(200).json({
            ok: true,
            data: cleanResponse(patient.toObject(), true),
            message: 'Paciente encontrado exitosamente',
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
