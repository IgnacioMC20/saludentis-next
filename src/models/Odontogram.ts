import mongoose, { Schema, model, Model } from 'mongoose'

import { IOdontogram, ITeethState, ITooth, IFace } from '@/interfaces'

// Schema for Face (tooth surface)
const faceSchema = new Schema<IFace>({
    position: { 
        type: String, 
        required: true,
        enum: ['top', 'bottom', 'right', 'left', 'center']
    },
    state: { 
        type: String, 
        required: true,
        default: 'white'
    },
    treatment: { 
        type: String, 
        required: true,
        default: ''
    }
}, { _id: false })

// Schema for Tooth
const toothSchema = new Schema<ITooth>({
    toothNumber: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: Schema.Types.Mixed, 
        required: true,
        default: true
    },
    faces: { 
        type: [faceSchema], 
        required: true,
        default: []
    },
    notes: { 
        type: String 
    }
}, { _id: false })

// Schema for TeethState (snapshot)
const teethStateSchema = new Schema<ITeethState>({
    teeth: { 
        type: [toothSchema], 
        required: true,
        default: []
    },
    savedAt: { 
        type: Date 
    },
    lastModified: { 
        type: Date 
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { _id: false })

// Main Odontogram Schema
const odontogramSchema = new Schema<IOdontogram>({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        unique: true,
        index: true
    },
    dentalArchType: {
        type: String,
        required: true,
        enum: ['adult', 'child'],
        default: 'adult'
    },
    initialState: {
        type: teethStateSchema,
        required: true
    },
    currentState: {
        type: teethStateSchema,
        required: true
    },
    consultationId: {
        type: Schema.Types.ObjectId,
        ref: 'Consultation'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
})

odontogramSchema.index({ updatedAt: -1 })

// Model for Odontogram
const Odontogram: Model<IOdontogram> = mongoose.models.Odontogram || model('Odontogram', odontogramSchema)

export default Odontogram
