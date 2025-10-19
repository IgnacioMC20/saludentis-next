import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

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
            return res.status(400).json({ ok: false, message: 'Bad request' })
    }
}

async function getBackgroundByPatientId(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { id: patientId } = req.query

    if (!patientId || !mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID',
        })
    }

    await db.connect()

    try {
        const background = await Background.findOne({ patientId }).lean()

        await db.disconnect()

        if (!background) {
            return res.status(404).json({
                ok: false,
                data: null,
                message: 'Background not found',
            })
        }

        return res.status(200).json({
            ok: true,
            data: background,
            message: 'Background retrieved successfully',
        })
    } catch (error: any) {
        console.error(error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Internal server error',
            errors: error.errors || null,
        })
    }
}

async function createBackground(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const backgroundData = req.body as IBackground

    if (!backgroundData.patientId || !mongoose.isValidObjectId(backgroundData.patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID',
        })
    }

    await db.connect()

    try {
        // Check if background already exists for this patient
        const existingBackground = await Background.findOne({ patientId: backgroundData.patientId })

        if (existingBackground) {
            await db.disconnect()
            return res.status(409).json({
                ok: false,
                message: 'Background already exists for this patient. Use PUT to update.',
            })
        }

        const newBackground = new Background(backgroundData)
        await newBackground.save()

        await db.disconnect()

        return res.status(201).json({
            ok: true,
            data: newBackground,
            message: 'Background created successfully',
        })
    } catch (error: any) {
        console.error(error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Internal server error',
            errors: error.errors || null,
        })
    }
}

async function updateBackground(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
    const { id: patientId } = req.query
    const backgroundData = req.body as Partial<IBackground>

    if (!patientId || !mongoose.isValidObjectId(patientId)) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid patient ID',
        })
    }

    await db.connect()

    try {
        const updatedBackground = await Background.findOneAndUpdate(
            { patientId },
            { $set: backgroundData },
            { new: true, runValidators: true }
        )

        await db.disconnect()

        if (!updatedBackground) {
            return res.status(404).json({
                ok: false,
                message: 'Background not found',
            })
        }

        return res.status(200).json({
            ok: true,
            data: updatedBackground,
            message: 'Background updated successfully',
        })
    } catch (error: any) {
        console.error(error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Internal server error',
            errors: error.errors || null,
        })
    }
}