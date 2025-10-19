import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { ApiResponse } from '@/interfaces'
import Background, { IBackground } from '@/models/Background'

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    switch (req.method) {
        case 'GET':
            return getBackgroundByPatientId(req, res)
        case 'POST':
            return createBackground(req, res)
        case 'PUT':
            return updateBackground(req, res)
        default:
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }
}

// GET /api/background/:patientId - Fetch patient's clinic history
const getBackgroundByPatientId = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
    const { id: patientId } = req.query

    if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'Patient ID is required'
        })
    }

    if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID format'
        })
    }

    await db.connect()

    try {
        const background = await Background.findOne({ patientId }).lean()

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: background,
            message: background ? 'Background found' : 'No background found for this patient'
        })
    } catch (error: any) {
        await db.disconnect()
        return res.status(500).json({
            ok: false,
            message: error.message || 'Error fetching background',
            errors: error
        })
    }
}

// POST /api/background - Create new clinic history record
const createBackground = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
    const { patientId, medicalHistory, familyHistory, dentalHistory } = req.body as IBackground

    if (!patientId) {
        return res.status(400).json({
            ok: false,
            message: 'Patient ID is required'
        })
    }

    if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID format'
        })
    }

    await db.connect()

    try {
        // Check if background already exists for this patient
        const existingBackground = await Background.findOne({ patientId })

        if (existingBackground) {
            await db.disconnect()
            return res.status(400).json({
                ok: false,
                message: 'Background already exists for this patient. Use PUT to update.'
            })
        }

        const newBackground = new Background({
            patientId,
            medicalHistory: medicalHistory || { conditions: [], notes: '' },
            familyHistory: familyHistory || { conditions: [], notes: '' },
            dentalHistory: dentalHistory || { conditions: [], notes: '' }
        })

        await newBackground.save()
        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: newBackground,
            message: 'Background created successfully'
        })
    } catch (error: any) {
        await db.disconnect()
        return res.status(500).json({
            ok: false,
            message: error.message || 'Error creating background',
            errors: error
        })
    }
}

// PUT /api/background/:patientId - Update existing clinic history
const updateBackground = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
    const { id: patientId } = req.query
    const { medicalHistory, familyHistory, dentalHistory } = req.body as Partial<IBackground>

    if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
            ok: false,
            message: 'Patient ID is required'
        })
    }

    if (!mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID format'
        })
    }

    await db.connect()

    try {
        const updateData: Partial<IBackground> = {}
        
        if (medicalHistory) updateData.medicalHistory = medicalHistory
        if (familyHistory) updateData.familyHistory = familyHistory
        if (dentalHistory) updateData.dentalHistory = dentalHistory

        const updatedBackground = await Background.findOneAndUpdate(
            { patientId },
            { $set: updateData },
            { new: true, runValidators: true }
        )

        if (!updatedBackground) {
            await db.disconnect()
            return res.status(404).json({
                ok: false,
                message: 'Background not found for this patient'
            })
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            data: updatedBackground,
            message: 'Background updated successfully'
        })
    } catch (error: any) {
        await db.disconnect()
        return res.status(500).json({
            ok: false,
            message: error.message || 'Error updating background',
            errors: error
        })
    }
}