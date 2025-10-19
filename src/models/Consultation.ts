import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for ConsultationDetail
export interface IConsultationDetail {
    tooth?: string;
    treatmentId?: mongoose.Types.ObjectId;
    diseaseId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for Consultation
export interface IConsultation {
    patientId?: mongoose.Types.ObjectId;
    total?: number;
    consultationDetails?: IConsultationDetail[]; // Array of ConsultationDetail
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for ConsultationDetail
const consultationDetailSchema = new Schema<IConsultationDetail>({
    tooth: { type: String },
    treatmentId: { type: mongoose.Types.ObjectId, ref: 'Treatment' },
    diseaseId: { type: mongoose.Types.ObjectId, ref: 'Disease' },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

// Schema for Consultation
const consultationSchema = new Schema<IConsultation>({
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },  // Reference to the 'Patient' collection
    total: { type: Number },
    consultationDetails: [consultationDetailSchema],  // Embedded array of ConsultationDetail schemas
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

// Model for Consultation
const Consultation: Model<IConsultation> = mongoose.models.Consultation || model('Consultation', consultationSchema)

export default Consultation
