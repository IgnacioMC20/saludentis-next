import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for ExamenIntraoral
export interface IIntraoralExam {
    patientId?: mongoose.Types.ObjectId;
    dentistId?: mongoose.Types.ObjectId;
    findings?: string;
    treatmentPlan?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for ExamenIntraoral
const intraoralExamSchema = new Schema<IIntraoralExam>({
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },   // Reference to Patient collection
    dentistId: { type: mongoose.Types.ObjectId, ref: 'Dentist' },   // Reference to Dentist collection
    findings: { type: String },
    treatmentPlan: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

const IntraoralExam: Model<IIntraoralExam> = mongoose.models.IntraoralExam || model('IntraoralExam', intraoralExamSchema)

export default IntraoralExam
