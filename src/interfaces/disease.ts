import { Types } from 'mongoose'

export interface IDisease {
    _id?: Types.ObjectId; // Unique identifier for the disease
    detail?: string; // Detail of the disease
    createdAt?: Date; // Automatic timestamp for creation
    updatedAt?: Date; // Automatic timestamp for updates
}
