import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Disease (Enfermedad)
export interface IDisease {
    detail?: string; // Detail of the disease
    createdAt?: Date; // Automatic timestamp for creation
    updatedAt?: Date; // Automatic timestamp for updates
}

// Schema for Disease
const diseaseSchema = new Schema<IDisease>({
    detail: { type: String, default: null } // Disease detail as a string
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Model for Disease
const Disease: Model<IDisease> = mongoose.models.Disease || model('Disease', diseaseSchema)

export default Disease
