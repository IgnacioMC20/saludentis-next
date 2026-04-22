import mongoose, { Schema, model, Model } from 'mongoose'

import type { ConsultationStatus } from '@/interfaces/reports'

// Interface for OdontogramChange
export interface IOdontogramChange {
    toothNumber: number;
    facePosition: string;
    treatment: string;
    color: string;
}

// Interface for ConsultationDetail
export interface IConsultationDetail {
    tooth?: string;
    treatmentId?: mongoose.Types.ObjectId;
    diseaseId?: mongoose.Types.ObjectId;
    odontogramChanges?: IOdontogramChange[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for Consultation
export interface IConsultation {
    patientId?: mongoose.Types.ObjectId;
    total?: number;
    consultationDetails?: IConsultationDetail[]; // Array of ConsultationDetail
    status?: ConsultationStatus;
    doctorName?: string;
    siteName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for OdontogramChange
const odontogramChangeSchema = new Schema<IOdontogramChange>({
    toothNumber: { type: Number, required: true },
    facePosition: { type: String, required: true },
    treatment: { type: String, required: true },
    color: { type: String, required: true }
}, { _id: false })

// Schema for ConsultationDetail
const consultationDetailSchema = new Schema<IConsultationDetail>({
    tooth: { type: String },
    treatmentId: { type: mongoose.Types.ObjectId, ref: 'Treatment' },
    diseaseId: { type: mongoose.Types.ObjectId, ref: 'Disease' },
    odontogramChanges: { type: [odontogramChangeSchema] },
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
    status: {
        type: String,
        enum: ['confirmada', 'completada', 'cancelada', 'no_asistio'],
        default: 'completada',
    },
    doctorName: { type: String, default: 'Sin asignar' },
    siteName: { type: String, default: 'Principal' },
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

// Model for Consultation
const Consultation: Model<IConsultation> = mongoose.models.Consultation || model('Consultation', consultationSchema)

export default Consultation
