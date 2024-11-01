import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Patient
export interface IPatient {
    firstName?: string;
    lastName?: string;
    address?: string;
    maritalStatus?: string;
    occupation?: string;
    guardianId?: mongoose.Types.ObjectId; // Refers to Guardian collection
    guardianName?: string;
    email?: string;
    lastVisit?: Date;
    birthDate?: Date;
    phone?: number;
    gender?: string;
    nationalId?: string;
    diet?: string;
    lastMedicalCheckup?: string;
    medications?: string;
    reasonForVisit?: string;
    emotionalState?: string;
    physicalActivity?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Patient
const patientSchema = new Schema<IPatient>({
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    guardianId: { type: mongoose.Types.ObjectId, ref: 'Guardian' },  // Reference to Guardian collection
    guardianName: { type: String },
    email: { type: String },
    lastVisit: { type: Date },
    birthDate: { type: Date },
    phone: { type: Number },
    gender: { type: String },
    nationalId: { type: String },
    diet: { type: String },
    lastMedicalCheckup: { type: String },
    medications: { type: String },
    reasonForVisit: { type: String },
    emotionalState: { type: String },
    physicalActivity: { type: String },
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
})

// Model for Patient
const Patient: Model<IPatient> = mongoose.models.Patient || model('Patient', patientSchema)

export default Patient
