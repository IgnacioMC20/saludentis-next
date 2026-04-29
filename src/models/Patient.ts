import mongoose, { Schema, model, Model } from 'mongoose'

import { IPatient } from '@/interfaces'

// Schema for Patient
const patientSchema = new Schema<IPatient>({
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    address: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    guardianId: { type: mongoose.Types.ObjectId, ref: 'Guardian' },  // Reference to Guardian collection
    guardianName: { type: String },
    guardianPhone: { type: String },
    email: { type: String },
    lastVisit: { type: Date },
    birthDate: { type: Date },
    phone: { type: Number },
    gender: { type: String },
    physicalActivity: { type: String },
    lastTreatment: { type: String },
    nationalId: { type: String, trim: true, unique: true, sparse: true },
    diet: { type: String },
    lastMedicalCheckup: { type: String },
    medications: { type: String },
    diagnosis: { type: String },
    annotations: { type: String },
    consultationReason: { type: String },
    emotionalState: { type: String },
    organSystems: { type: [String], default: [] },
    currentOdontogramId: { type: mongoose.Types.ObjectId, ref: 'Odontogram' },  // Reference to Odontogram collection
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt`
})

// Model for Patient
const Patient: Model<IPatient> = mongoose.models.Patient || model('Patient', patientSchema)

export default Patient
