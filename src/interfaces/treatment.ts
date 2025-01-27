import { Types } from 'mongoose'

export interface ITreatment {
    _id: string | Types.ObjectId;
    __v?: number;
    description?: string;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
}