import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for HigieneOral
export interface IOralHygiene {
    patientId?: mongoose.Types.ObjectId;
    hygieneLevel?: string;
    recommendations?: string;
    date?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for HigieneOral
const oralHygieneSchema = new Schema<IOralHygiene>({
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },  // Reference to Patient collection
    hygieneLevel: { type: String },   // e.g., Good, Fair, Poor
    recommendations: { type: String },
    date: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

const OralHygiene: Model<IOralHygiene> = mongoose.models.OralHygiene || model('OralHygiene', oralHygieneSchema)

export default OralHygiene
