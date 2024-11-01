import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Treatment
export interface ITreatment {
    description?: string;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

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
