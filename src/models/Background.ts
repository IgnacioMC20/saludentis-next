import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for history sections
export interface IHistorySection {
    conditions: string[];
    notes: string;
}

// Interface for Antecedentes (Background/Clinic History)
export interface IBackground {
    patientId: mongoose.Types.ObjectId;
    medicalHistory: IHistorySection;
    familyHistory: IHistorySection;
    dentalHistory: IHistorySection;
    createdAt?: Date;
    updatedAt?: Date;
}

// Sub-schema for history sections
const historySectionSchema = new Schema<IHistorySection>({
    conditions: { type: [String], default: [] },
    notes: { type: String, default: '' }
}, { _id: false })

// Schema for Antecedentes
const backgroundSchema = new Schema<IBackground>({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
    medicalHistory: { type: historySectionSchema, default: () => ({ conditions: [], notes: '' }) },
    familyHistory: { type: historySectionSchema, default: () => ({ conditions: [], notes: '' }) },
    dentalHistory: { type: historySectionSchema, default: () => ({ conditions: [], notes: '' }) }
}, {
    timestamps: true
})

const Background: Model<IBackground> = mongoose.models.Background || model('Background', backgroundSchema)

export default Background
