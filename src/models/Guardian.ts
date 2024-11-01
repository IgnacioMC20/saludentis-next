import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Guardian (Encargado)
export interface IGuardian {
    type?: string
}

// Schema for Guardian
const guardianSchema = new Schema<IGuardian>({
    type: { type: String, default: null } // Type is a string, default is null
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
})

// Model for Guardian
const Guardian: Model<IGuardian> = mongoose.models.Guardian || model('Guardian', guardianSchema)

export default Guardian
