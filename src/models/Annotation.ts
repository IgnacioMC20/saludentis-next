import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Anotaciones
export interface IAnnotation {
    details?: string;
    patientId?: mongoose.Types.ObjectId;
    diagnosis?: string;
    updatedAt?: Date;
    createdAt?: Date;
    familyHistory?: string;
    dentalHistory?: string;
}

// Schema for Anotaciones
const annotationSchema = new Schema<IAnnotation>({
    details: { type: String },
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' }, // Reference to Patient collection
    diagnosis: { type: String },
    updatedAt: { type: Date },
    createdAt: { type: Date },
    familyHistory: { type: String },
    dentalHistory: { type: String }
}, {
    timestamps: true // Automatically add `createdAt` and `updatedAt` fields
})

const Annotation: Model<IAnnotation> = mongoose.models.Annotation || model('Annotation', annotationSchema)

export default Annotation
