import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Diet
export interface IDiet {
    patientId: mongoose.Types.ObjectId;
    organSystems: string[];
    dietNotes: string;
    moodNotes: string;
    physicalActivityNotes: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Diet
const dietSchema = new Schema<IDiet>({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
    organSystems: { type: [String], default: [] },
    dietNotes: { type: String, default: '' },
    moodNotes: { type: String, default: '' },
    physicalActivityNotes: { type: String, default: '' }
}, {
    timestamps: true
})

const Diet: Model<IDiet> = mongoose.models.Diet || model('Diet', dietSchema)

export default Diet