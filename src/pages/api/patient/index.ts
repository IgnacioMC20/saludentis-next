import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import Patient, { IPatient } from '@/models/Patient'

interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

// type Data = { message: string } | { patients: IPatient[], message?: string } | IPatient

export default function (req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'POST':
            return createPatient(req, res)
        case 'GET':
            return getPatients(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }

    async function createPatient(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
        const patientData = req.body as IPatient

        console.log(patientData)
        await db.connect()

        try {
            const existingPatient = await Patient.findOne({ nationalId: patientData.nationalId })
            if (existingPatient) {
                return res.status(400).json({
                    ok: false,
                    message: 'Ya existe un paciente con ese DPI/CUI',
                })
            }

            const newPatient = new Patient(patientData)

            await newPatient.save()
            await db.disconnect()

            return res.status(201).json({
                ok: true,
                data: newPatient,
                message: 'Paciente creado exitosamente',
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
    async function getPatients(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
        await db.connect()
        const patients = await Patient.find()
        await db.disconnect()
        if (!patients || patients.length === 0)
            return res.status(404).json({ ok: false, data: [], message: 'No se encontraron pacientes' })
        return res.status(200).json({ data: patients, ok: true })
    }
}