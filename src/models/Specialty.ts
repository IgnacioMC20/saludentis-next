import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Especialidades
export interface ISpecialty {
    name?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Especialidades
const specialtySchema = new Schema<ISpecialty>({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

const Specialty: Model<ISpecialty> = mongoose.models.Specialty || model('Specialty', specialtySchema)

export default Specialty
