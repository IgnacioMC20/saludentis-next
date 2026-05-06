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

const maskNationalId = (nationalId?: string) => {
    if (!nationalId) return undefined
    if (nationalId.length <= 4) return '****'

    return `${nationalId.slice(0, 2)}****${nationalId.slice(-2)}`
}

const getPatientLogContext = (patientData?: Partial<IPatient>) => ({
    patientId: patientData?._id?.toString(),
    firstName: patientData?.firstName,
    lastName: patientData?.lastName,
    hasNationalId: Boolean(patientData?.nationalId),
    nationalId: maskNationalId(patientData?.nationalId),
    hasBirthDate: Boolean(patientData?.birthDate),
    hasPhone: patientData?.phone !== undefined && patientData?.phone !== null,
    odontogramProfile: patientData?.odontogramProfile,
})

const serializeError = (error: any) => ({
    name: error?.name,
    message: error?.message,
    code: error?.code,
    keyPattern: error?.keyPattern,
    keyValue: error?.keyValue
        ? {
            ...error.keyValue,
            nationalId: maskNationalId(error.keyValue.nationalId),
        }
        : undefined,
    validationErrors: error?.errors
        ? Object.fromEntries(
            Object.entries(error.errors).map(([field, fieldError]: [string, any]) => [
                field,
                {
                    name: fieldError?.name,
                    message: fieldError?.message,
                    kind: fieldError?.kind,
                    path: fieldError?.path,
                    value: fieldError?.path === 'nationalId' ? maskNationalId(fieldError?.value) : fieldError?.value,
                },
            ])
        )
        : undefined,
})

const normalizePatientData = (patientData: IPatient) => {
    const nationalId = patientData.nationalId?.trim()
    const normalizedData: any = {
        ...patientData,
        nationalId: nationalId || undefined,
    }

    if (!normalizedData.nationalId) {
        delete normalizedData.nationalId
    }

    if (!normalizedData.lastVisit) {
        delete normalizedData.lastVisit
    }

    if (!normalizedData.birthDate) {
        delete normalizedData.birthDate
    }

    if (normalizedData.phone === '' || normalizedData.phone === undefined || normalizedData.phone === null) {
        delete normalizedData.phone
    } else {
        normalizedData.phone = Number(normalizedData.phone)
    }

    return normalizedData as IPatient
}

const getOdontogramProfile = (
    birthDate?: Date | string,
    referenceDate?: Date | string
): 'adult' | 'child' => {
    if (!birthDate) return 'adult'

    const birth = new Date(birthDate)
    const reference = referenceDate ? new Date(referenceDate) : new Date()

    if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
        return 'adult'
    }

    const age = reference.getFullYear() - birth.getFullYear()
    const birthdayPassed =
        reference.getMonth() > birth.getMonth() ||
        (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate())

    const isAdult = birthdayPassed ? age >= 18 : age - 1 >= 18
    return isAdult ? 'adult' : 'child'
}

async function createPatient(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const patientData = normalizePatientData(req.body as IPatient)
    const logContext = getPatientLogContext(patientData)

    console.info('[patient:create] request received', logContext)

    await db.connect()

    try {
        if (patientData.nationalId) {
            const existingPatient = await Patient.findOne({ nationalId: patientData.nationalId })
            if (existingPatient) {
                console.warn('[patient:create] duplicate nationalId', {
                    ...logContext,
                    existingPatientId: existingPatient._id?.toString(),
                })
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
        newPatient.odontogramProfile = patientData.odontogramProfile || getOdontogramProfile(patientData.birthDate)

        await newPatient.save()
        console.info('[patient:create] patient saved', {
            ...logContext,
            patientId: newPatient._id?.toString(),
        })

        const newBalance = new Balance({
            patientId: newPatient._id,
            balance: 0,
            balanceDetails: []
        })

        await newBalance.save()
        console.info('[patient:create] balance created', {
            patientId: newPatient._id?.toString(),
            balanceId: newBalance._id?.toString(),
        })

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: newPatient,
            message: 'Paciente creado exitosamente',
        })
    } catch (error: any) {
        console.error('[patient:create] failed', {
            context: logContext,
            error: serializeError(error),
        })

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function getPatients(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    console.info('[patient:list] request received')

    try {
        await db.connect()
        const patients = await Patient.find().lean()
        await db.disconnect()
        console.info('[patient:list] request completed', {
            count: patients?.length || 0,
        })
        if (!patients || patients.length === 0)
            return res.status(404).json({ ok: false, data: [], message: 'No se encontraron pacientes' })
        return res.status(200).json({ data: cleanResponse(patients, true), ok: true })
    } catch (error: any) {
        console.error('[patient:list] failed', {
            error: serializeError(error),
        })

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

async function updatePatient(req: NextApiRequest, res: NextApiResponse<ApiResponse<any>>) {
    const patientData = normalizePatientData(req.body as IPatient)
    const logContext = getPatientLogContext(patientData)

    console.info('[patient:update] request received', logContext)

    await db.connect()

    try {
        if (!patientData._id) {
            console.warn('[patient:update] missing patient id', logContext)
            await db.disconnect()
            return res.status(400).json({
                ok: false,
                message: 'El ID del paciente es requerido',
            })
        }

        if (patientData.nationalId) {
            const existingPatient = await Patient.findOne({
                nationalId: patientData.nationalId,
                _id: { $ne: patientData._id },
            })

            if (existingPatient) {
                console.warn('[patient:update] duplicate nationalId', {
                    ...logContext,
                    existingPatientId: existingPatient._id?.toString(),
                })
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
                    ...(patientData.odontogramProfile ? { odontogramProfile: patientData.odontogramProfile } : {}),
                },
                ...(nationalId ? {} : { $unset: { nationalId: 1 } }),
            },
            { new: true, runValidators: true }
        )

        if (updatedPatient) {
            console.info('[patient:update] patient updated', {
                ...logContext,
                patientId: updatedPatient._id?.toString(),
            })
            await db.disconnect()
            return res.status(200).json({
                ok: true,
                data: updatedPatient,
                message: 'Paciente actualizado exitosamente',
            })
        }
        console.warn('[patient:update] patient not found', logContext)
        await db.disconnect()

        return res.status(401).json({
            ok: false,
            message: 'No existe un paciente con ese ID',
        })
    } catch (error: any) {
        console.error('[patient:update] failed', {
            context: logContext,
            error: serializeError(error),
        })

        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Error interno del servidor',
            errors: error.errors || null,
        })
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
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
}
