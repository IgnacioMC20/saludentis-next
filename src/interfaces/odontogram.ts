import { Types } from 'mongoose'

/**
 * Represents a single face (surface) of a tooth
 */
export interface IFace {
  position: 'top' | 'bottom' | 'right' | 'left' | 'center';
  state: string; // Color code: 'white', '#00b4d8', '#ffc300', etc.
  treatment: string; // Treatment name: 'Amalgama', 'Resina', 'Caries', etc.
}

/**
 * Represents a single tooth with its status and faces
 */
export interface ITooth {
  toothNumber: number; // 1-32 for adult, 51-85 for child
  status: boolean | 'extraction'; // true = present, false = absent, 'extraction' = extracted
  faces: IFace[];
  notes?: string;
}

/**
 * Represents a snapshot of teeth state at a specific point in time
 */
export interface ITeethState {
  teeth: ITooth[];
  savedAt?: Date;
  lastModified?: Date;
  lastModifiedBy?: string | Types.ObjectId;
}

/**
 * Main Odontogram interface
 * Stores both initial state (never modified) and current state (updated with auto-save)
 */
export interface IOdontogram {
  _id?: string | Types.ObjectId;
  patientId: string | Types.ObjectId;
  dentalArchType: 'adult' | 'child';
  initialState: ITeethState;
  currentState: ITeethState;
  consultationId?: string | Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a single change between two states
 */
export interface IChange {
  toothNumber: number;
  field: 'status' | 'face';
  facePosition?: string;
  oldValue: any;
  newValue: any;
}

/**
 * Result of comparing initial state vs current state
 */
export interface IComparisonResult {
  initialState: ITeethState;
  currentState: ITeethState;
  changes: IChange[];
  summary: {
    teethModified: number;
    facesChanged: number;
    extractionsAdded: number;
    extractionsRemoved: number;
  };
}

/**
 * Constants for validation
 */
export const ADULT_TEETH = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
] as const

export const CHILD_TEETH = [
  51, 52, 53, 54, 55, 61, 62, 63, 64, 65,
  71, 72, 73, 74, 75, 81, 82, 83, 84, 85
] as const

export const VALID_FACE_STATES = [
  'white',
  '#00b4d8', // Amalgama
  '#ffc300', // Resina
  '#c1121f', // Caries
  '#0077b6', // Corona
  '#720026', // TCR
  '#9d4edd', // Malposición
] as const

export const TREATMENT_COLORS: Record<string, string> = {
  'Amalgama': '#00b4d8',
  'Resina': '#ffc300',
  'Caries': '#c1121f',
  'Corona': '#0077b6',
  'TCR': '#720026',
  'Malposición': '#9d4edd',
  'Extracción': 'gray',
}

export type DentalArchType = 'adult' | 'child'
export type ToothStatus = boolean | 'extraction'
export type FacePosition = 'top' | 'bottom' | 'right' | 'left' | 'center'