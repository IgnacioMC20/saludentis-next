import mongoose, { Schema, model, Model } from 'mongoose'

import { IDisease } from '@/interfaces'

// Interface for Disease (Enfermedad)
// Schema for Disease
const diseaseSchema = new Schema<IDisease>({
    detail: { type: String, default: null } // Disease detail as a string
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Model for Disease
const Disease: Model<IDisease> = mongoose.models.Disease || model('Disease', diseaseSchema)

export default Disease
