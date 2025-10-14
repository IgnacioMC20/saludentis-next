import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { cleanResponse } from '@/api'
import { db } from '@/database'
import Diagnostic, { IDiagnostic } from '@/models/Diagnostic'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getDiagnosticByPatientId(req, res)
        case 'POST':
            return createDiagnostic(req, res)
        case 'PUT':
            return updateDiagnostic(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Solicitud incorrecta' })
    }
}

async function getDiagnosticByPatientId(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
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
        const diagnostic = await Diagnostic.findOne({ patientId: id }).lean()

        await db.disconnect()

        if (!diagnostic) {
            return res.status(200).json({
                ok: true,
                data: null,
                message: 'No se encontró diagnóstico para este paciente',
            })
        }

        return res.status(200).json({
            ok: true,
            data: cleanResponse(diagnostic, true),
            message: 'Diagnóstico encontrado exitosamente',
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

async function createDiagnostic(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const diagnosticData = req.body as IDiagnostic


    // Validate required fields
    if (!diagnosticData.patientId) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente es requerido',
        })
    }

    if (!mongoose.isValidObjectId(diagnosticData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'El ID del paciente no es válido',
        })
    }

    await db.connect()

    try {
        // Check if diagnostic already exists for this patient
        const existingDiagnostic = await Diagnostic.findOne({ patientId: diagnosticData.patientId })

        if (existingDiagnostic) {
            await db.disconnect()
            return res.status(400).json({
                ok: false,
                message: 'Ya existe un diagnóstico para este paciente. Use PUT para actualizar.',
            })
        }

        const newDiagnostic = new Diagnostic(diagnosticData)
        await newDiagnostic.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: cleanResponse(newDiagnostic.toObject()),
            message: 'Diagnóstico creado exitosamente',
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

async function updateDiagnostic(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const {
        query: { id },
    } = req
    const diagnosticData = req.body as Partial<IDiagnostic>


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
        const updatedDiagnostic = await Diagnostic.findOneAndUpdate(
            { patientId: id },
            {
                $set: {
                    diagnosis: diagnosticData.diagnosis,
                    prescribedMedications: diagnosticData.prescribedMedications,
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedDiagnostic) {
            await db.disconnect()
            return res.status(404).json({
                ok: false,
                message: 'Diagnóstico no encontrado',
            })
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: cleanResponse(updatedDiagnostic.toObject()),
            message: 'Diagnóstico actualizado exitosamente',
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