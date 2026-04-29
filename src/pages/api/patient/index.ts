import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import { IPatient } from '@/interfaces'
import Balance from '@/models/Balance'
import Patient from '@/models/Patient'

export interface ApiResponse<T = any> {
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
        case 'PUT':
            return updatePatient(req, res)
        case 'GET':
            return getPatients(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }

    const normalizePatientData = (patientData: IPatient) => {
        const nationalId = patientData.nationalId?.trim()

        return {
            ...patientData,
            nationalId: nationalId || undefined,
        }
    }

    async function createPatient(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
        const patientData = normalizePatientData(req.body as IPatient)

        await db.connect()

        try {
            await Patient.syncIndexes()

            if (patientData.nationalId) {
                const existingPatient = await Patient.findOne({ nationalId: patientData.nationalId })
                if (existingPatient) {
                    await db.disconnect()
                    return res.status(400).json({
                        ok: false,
                        message: 'Ya existe un paciente con ese DPI/CUI',
                    })
                }
            }

            const newPatient = new Patient(patientData)

            newPatient.consultationReason = patientData.consultationReason
            newPatient.lastTreatment = patientData.lastTreatment

            await newPatient.save()

            // Create a balance record for the new patient
            const newBalance = new Balance({
                patientId: newPatient._id,
                balance: 0,
                balanceDetails: []
            })

            await newBalance.save()

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
        const patients = await Patient.find().lean()
        await db.disconnect()
        if (!patients || patients.length === 0)
            return res.status(404).json({ ok: false, data: [], message: 'No se encontraron pacientes' })
        return res.status(200).json({ data: cleanResponse(patients, true), ok: true })
    }

    async function updatePatient(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
        const patientData = normalizePatientData(req.body as IPatient)

        await db.connect()

        try {
            if (!patientData._id) {
                await db.disconnect()
                return res.status(400).json({
                    ok: false,
                    message: 'El ID del paciente es requerido',
                })
            }

            await Patient.syncIndexes()

            if (patientData.nationalId) {
                const existingPatient = await Patient.findOne({
                    nationalId: patientData.nationalId,
                    _id: { $ne: patientData._id },
                })

                if (existingPatient) {
                    await db.disconnect()
                    return res.status(400).json({
                        ok: false,
                        message: 'Ya existe un paciente con ese DPI/CUI',
                    })
                }
            }

            const { _id, nationalId, ...restPatientData } = patientData
            const updatedPatient = await Patient.findOneAndUpdate(
                { _id },
                {
                    $set: {
                        ...restPatientData,
                        ...(nationalId ? { nationalId } : {}),
                    },
                    ...(nationalId ? {} : { $unset: { nationalId: 1 } }),
                },
                { new: true, runValidators: true }
            )

            if (updatedPatient) {
                await db.disconnect()
                return res.status(200).json({
                    ok: true,
                    data: updatedPatient,
                    message: 'Paciente actualizado exitosamente',
                })
            }
            await db.disconnect()

            return res.status(401).json({
                ok: false,
                message: 'No existe un paciente con ese ID',
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
}
