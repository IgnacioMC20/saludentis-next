import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for BalanceDetail
export interface IBalanceDetail {
    consultationId?: mongoose.Types.ObjectId;
    amount?: number;
    total?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for Balance
export interface IBalance {
    patientId?: mongoose.Types.ObjectId;
    balance?: number;
    balanceDetails?: IBalanceDetail[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for BalanceDetail
const balanceDetailSchema = new Schema<IBalanceDetail>({
    consultationId: { type: mongoose.Types.ObjectId, ref: 'Consultation' }, // Reference to Consultation
    amount: { type: Number },
    total: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

// Schema for Balance
const balanceSchema = new Schema<IBalance>({
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' },    // Reference to Patient
    balance: { type: Number, default: 0 },                          // Default balance is 0
    balanceDetails: [balanceDetailSchema],                           // Array of BalanceDetail
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Model for Balance
const Balance: Model<IBalance> = mongoose.models.Balance || model('Balance', balanceSchema)

export default Balance
