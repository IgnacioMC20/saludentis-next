import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Hoa
export interface IHoa {
    detail?: string; // Detail of HOA
    createdAt?: Date; // Timestamp for creation
    updatedAt?: Date; // Timestamp for updates
}

// Schema for Hoa
const hoaSchema = new Schema<IHoa>({
    detail: { type: String, default: null }, // HOA detail as a string
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
})

// Model for Hoa
const Hoa: Model<IHoa> = mongoose.models.Hoa || model('Hoa', hoaSchema)

export default Hoa
