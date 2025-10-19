import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Neurofocal
export interface INeurofocal {
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Neurofocal
const neurofocalSchema = new Schema<INeurofocal>({
    description: { type: String, required: false, maxlength: 45 }, // Detalle del neurofocal
}, {
    timestamps: true // Automáticamente añade `createdAt` y `updatedAt`
})

// Model for Neurofocal
const Neurofocal: Model<INeurofocal> = mongoose.models.Neurofocal || model('Neurofocal', neurofocalSchema)

export default Neurofocal
