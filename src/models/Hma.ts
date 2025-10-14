import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Hma
export interface IHma {
    detail?: string; // Detail of HMA
    createdAt?: Date; // Timestamp for creation
    updatedAt?: Date; // Timestamp for updates
}

// Schema for Hma
const hmaSchema = new Schema<IHma>({
    detail: { type: String, default: null }, // HMA detail as a string
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
})

// Model for Hma
const Hma: Model<IHma> = mongoose.models.Hma || model('Hma', hmaSchema)

export default Hma
