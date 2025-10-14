import mongoose, { Schema, model, Model } from 'mongoose'

import { ITreatment } from '@/interfaces'

// Interface for Treatment

// Schema for Treatment
const treatmentSchema = new Schema<ITreatment>({
    description: { type: String }, // Detalle del tratamiento
    price: { type: Number }, // Precio del tratamiento
}, {
    timestamps: true // Automáticamente añade `createdAt` y `updatedAt`
})

// Model for Treatment
const Treatment: Model<ITreatment> = mongoose.models.Treatment || model('Treatment', treatmentSchema)

export default Treatment
