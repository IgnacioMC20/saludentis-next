import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Diagnostic
export interface IDiagnostic {
    patientId: mongoose.Types.ObjectId;
    diagnosis: string;
    prescribedMedications: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Diagnostic
const diagnosticSchema = new Schema<IDiagnostic>({
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
    diagnosis: { type: String, default: '' },
    prescribedMedications: { type: String, default: '' }
}, {
    timestamps: true
})

const Diagnostic: Model<IDiagnostic> = mongoose.models.Diagnostic || model('Diagnostic', diagnosticSchema)

export default Diagnostic