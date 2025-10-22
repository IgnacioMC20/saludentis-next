import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import Quotation, { IQuotation } from '@/models/Quotation'

type Data =
    | { message: string, ok: boolean }
    | {
        quotation: IQuotation;
        message: string;
        ok: boolean;
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getQuotationById(req, res)

        case 'PUT':
            return updateQuotation(req, res)

        case 'DELETE':
            return deleteQuotation(req, res)

        default:
            return res.status(400).json({ message: 'Método no soportado', ok: false })
    }
}

const getQuotationById = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la cotización no es válido',
            ok: false
        })
    }

    try {
        await db.connect()

        const quotation = await Quotation.findById(id)
            .populate('patientId', 'firstName middleName lastName nationalId')
            .populate('quotationDetails.treatmentId', 'description price')
            .populate('quotationDetails.diseaseId', 'detail')
            .lean()

        if (!quotation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Cotización no encontrada',
                ok: false
            })
        }

        console.log('Quotation fetched:', JSON.stringify(quotation, null, 2))

        await db.disconnect()

        return res.status(200).json({
            quotation,
            message: 'Cotización encontrada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al obtener la cotización:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al obtener los datos de la cotización',
            ok: false
        })
    }
}

const updateQuotation = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query
    const quotationData = req.body as IQuotation

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la cotización no es válido',
            ok: false
        })
    }

    // Validate quotation details if provided
    if (quotationData.quotationDetails && quotationData.quotationDetails.length > 0) {
        for (const detail of quotationData.quotationDetails) {
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

    try {
        await db.connect()

        const quotation = await Quotation.findById(id)

        if (!quotation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Cotización no encontrada',
                ok: false
            })
        }

        // Update the quotation
        const updatedQuotation = await Quotation.findByIdAndUpdate(
            id,
            quotationData,
            { new: true, runValidators: true }
        )

        await db.disconnect()

        return res.status(200).json({
            quotation: updatedQuotation!,
            message: 'Cotización actualizada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al actualizar la cotización:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al actualizar los datos de la cotización',
            ok: false
        })
    }
}

const deleteQuotation = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { id } = req.query

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'El ID de la cotización no es válido',
            ok: false
        })
    }

    try {
        await db.connect()

        const quotation = await Quotation.findById(id)

        if (!quotation) {
            await db.disconnect()
            return res.status(404).json({
                message: 'Cotización no encontrada',
                ok: false
            })
        }

        // Delete the quotation
        await Quotation.findByIdAndDelete(id)

        await db.disconnect()

        return res.status(200).json({
            message: 'Cotización eliminada exitosamente',
            ok: true
        })

    } catch (error) {
        console.error('Error al eliminar la cotización:', error)
        await db.disconnect()

        return res.status(500).json({
            message: 'Error al eliminar la cotización',
            ok: false
        })
    }
}