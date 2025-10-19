import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Type
export interface IType {
    detail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Type
const typeSchema = new Schema<IType>({
    detail: { type: String, required: false, maxlength: 255 } // Detalle del tipo
}, {
    timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
})

// Model for Type
const Type: Model<IType> = mongoose.models.Type || model('Type', typeSchema)

export default Type
