import mongoose, { Schema, model, Model } from 'mongoose'

// Interface for Antecedentes
export interface IBackground {
    typeId?: mongoose.Types.ObjectId;
    hmaId?: mongoose.Types.ObjectId;
    hoaId?: mongoose.Types.ObjectId;
    neuroId?: mongoose.Types.ObjectId;
    patientId?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema for Antecedentes
const backgroundSchema = new Schema<IBackground>({
    typeId: { type: mongoose.Types.ObjectId, ref: 'Type' },   // Reference to Type collection
    hmaId: { type: mongoose.Types.ObjectId, ref: 'Hma' },     // Reference to Hma collection
    hoaId: { type: mongoose.Types.ObjectId, ref: 'Hoa' },     // Reference to Hoa collection
    neuroId: { type: mongoose.Types.ObjectId, ref: 'Neuro' }, // Reference to Neurofocal collection
    patientId: { type: mongoose.Types.ObjectId, ref: 'Patient' }, // Reference to Patient collection
    createdAt: { type: Date },
    updatedAt: { type: Date }
}, {
    timestamps: true
})

const Background: Model<IBackground> = mongoose.models.Background || model('Background', backgroundSchema)

export default Background
