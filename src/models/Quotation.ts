// Cotizacion
import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for QuotationDetail
export interface IQuotationDetail {
    treatmentId?: mongoose.Types.ObjectId;
    diseaseId?: mongoose.Types.ObjectId;
    tooth?: string;
}

// Interface for Quotation
export interface IQuotation {
    patientId?: mongoose.Types.ObjectId;
    annotations?: string;
    total?: number;
    quotationDetails?: IQuotationDetail[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for QuotationDetail
const quotationDetailSchema = new Schema<IQuotationDetail>({
    treatmentId: { type: mongoose.Types.ObjectId, ref: 'Treatment' }, // Reference to Treatment
    diseaseId: { type: mongoose.Types.ObjectId, ref: 'Disease' },     // Reference to Disease
    tooth: { type: String }
})

// Schema for Quotation
const quotationSchema = new Schema<IQuotation>({
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },      // Reference to Patient
    annotations: { type: String },
    total: { type: Number },
    quotationDetails: [quotationDetailSchema],                         // Array of QuotationDetail
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
})

// Model for Quotation
const Quotation: Model<IQuotation> = mongoose.models.Quotation || model('Quotation', quotationSchema)

export default Quotation
