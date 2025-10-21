import mongoose, { Types } from 'mongoose'

// Interface for Patient
export interface IPatient {
  _id: string | Types.ObjectId;
  __v?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  address?: string;
  maritalStatus?: string;
  occupation?: string;
  guardianId?: mongoose.Types.ObjectId; // Refers to Guardian collection
  guardianName?: string;
  guardianPhone?: string;
  email?: string;
  lastVisit?: Date;
  birthDate?: Date;
  phone?: number;
  gender?: string;
  nationalId?: string;
  diet?: string;
  lastMedicalCheckup?: string;
  medications?: string;
  diagnosis?: string;
  reasonForVisit?: string;
  emotionalState?: string;
  physicalActivity?: string;
  organSystems?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  lastTreatment?: string;
  consultationReason?: string;
  currentOdontogramId?: mongoose.Types.ObjectId; // Refers to Odontogram collection
}