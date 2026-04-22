import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { CONSULTATION_STATUS_OPTIONS } from '@/interfaces/reports'
import Balance from '@/models/Balance'
import Consultation, { IConsultation } from '@/models/Consultation'

type Data =
    | { message: string, ok: boolean }
    | {
        consultation: IConsultation;
        message: string;
        ok: boolean;
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getConsultationById(req, res)

        case 'PUT':
            return updateConsultation(req, res)

        case 'DELETE':
            return deleteConsultation(req, res)

        default:
            return res.status(400).json({ message: 'Método no soportado', ok: false })
    }
}

const getConsultationById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la consulta no es válido',
            ok: false
        })
    }

    try {
        await db.connect()

        let consultation = await Consultation.findById(id)
            .populate('patientId', 'firstName middleName lastName nationalId')

        if (!consultation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Consulta no encontrada',
                ok: false
            })
        }

        // Manually populate nested fields in consultationDetails
        if (consultation.consultationDetails && consultation.consultationDetails.length > 0) {
            await consultation.populate([
                {
                    path: 'consultationDetails.treatmentId',
                    select: 'description price'
                },
                {
                    path: 'consultationDetails.diseaseId',
                    select: 'detail'
                }
            ])
        }

        await db.disconnect()

        return res.status(200).json({
            consultation: {
                ...consultation.toObject(),
                status: CONSULTATION_STATUS_OPTIONS.includes(consultation.status as any)
                    ? consultation.status
                    : 'completada',
                doctorName: consultation.doctorName || 'Sin asignar',
                siteName: consultation.siteName || 'Principal',
            } as any,
            message: 'Consulta encontrada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al obtener la consulta:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al obtener los datos de la consulta',
            ok: false
        })
    }
}

const updateConsultation = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query
    const consultationData = req.body as IConsultation

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la consulta no es válido',
            ok: false
        })
    }

    // Validate consultation details if provided
    if (consultationData.consultationDetails && consultationData.consultationDetails.length > 0) {
        for (const detail of consultationData.consultationDetails) {
            if (detail.treatmentId && !mongoose.isValidObjectId(detail.treatmentId)) {
                return res.status(400).json({
                    message: 'El ID del tratamiento no es válido',
                    ok: false
                })
            }
            if (detail.diseaseId && !mongoose.isValidObjectId(detail.diseaseId)) {
                return res.status(400).json({
                    message: 'El ID de la enfermedad no es válido',
                    ok: false
                })
            }
        }
    }

    if (
        consultationData.status
        && !CONSULTATION_STATUS_OPTIONS.includes(consultationData.status as any)
    ) {
        return res.status(400).json({
            message: 'El estado de la consulta no es válido',
            ok: false
        })
    }

    try {
        await db.connect()

        const consultation = await Consultation.findById(id)

        if (!consultation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Consulta no encontrada',
                ok: false
            })
        }

        // Update the consultation
        const updatedConsultation = await Consultation.findByIdAndUpdate(
            id,
            {
                ...consultationData,
                doctorName: consultationData.doctorName?.trim() || consultation.doctorName || 'Sin asignar',
                siteName: consultationData.siteName?.trim() || consultation.siteName || 'Principal',
            },
            { new: true, runValidators: true }
        )

        await db.disconnect()

        return res.status(200).json({
            consultation: updatedConsultation!,
            message: 'Consulta actualizada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al actualizar la consulta:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al actualizar los datos de la consulta',
            ok: false
        })
    }
}

const deleteConsultation = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la consulta no es válido',
            ok: false
        })
    }

    try {
        await db.connect()

        const consultation = await Consultation.findById(id)

        if (!consultation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Consulta no encontrada',
                ok: false
            })
        }

        // Check if this consultation is referenced in any balance
        const balanceWithConsultation = await Balance.findOne({
            'balanceDetails.consultationId': id
        })

        if (balanceWithConsultation) {
            await db.disconnect()
            return res.status(400).json({
                message: 'No se puede eliminar la consulta porque está asociada a un saldo',
                ok: false
            })
        }

        // Delete the consultation
        await Consultation.findByIdAndDelete(id)

        await db.disconnect()

        return res.status(200).json({
            message: 'Consulta eliminada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al eliminar la consulta:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al eliminar la consulta',
            ok: false
        })
    }
}
