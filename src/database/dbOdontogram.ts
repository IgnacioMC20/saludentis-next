import { db } from '.'
import {
    IOdontogram,
    ITeethState,
    IChange,
    IComparisonResult,
    ADULT_TEETH,
    CHILD_TEETH,
    ITooth,
} from '@/interfaces'
import Odontogram from '@/models/Odontogram'

/**
 * Creates default teeth array for a dental arch type
 */
const createDefaultTeeth = (archType: 'adult' | 'child'): ITooth[] => {
    const teethNumbers = archType === 'adult' ? ADULT_TEETH : CHILD_TEETH
    
    return teethNumbers.map(toothNumber => ({
        toothNumber,
        status: true,
        faces: [
            { position: 'top' as const, state: 'white', treatment: 'Ninguno' },
            { position: 'bottom' as const, state: 'white', treatment: 'Ninguno' },
            { position: 'right' as const, state: 'white', treatment: 'Ninguno' },
            { position: 'left' as const, state: 'white', treatment: 'Ninguno' },
            { position: 'center' as const, state: 'white', treatment: 'Ninguno' }
        ]
    }))
}

const createCompleteTeethSet = (): ITooth[] => [
    ...createDefaultTeeth('adult'),
    ...createDefaultTeeth('child'),
]

const ensureTeethSet = (teeth: ITooth[] = []): ITooth[] => {
    const teethByNumber = new Map(teeth.map(tooth => [tooth.toothNumber, tooth]))

    return createCompleteTeethSet().map(defaultTooth => (
        teethByNumber.get(defaultTooth.toothNumber) || defaultTooth
    ))
}

/**
 * Get or create odontogram for a patient
 * If odontogram doesn't exist, creates one with default white teeth
 */
export const getOrCreateOdontogram = async (
    patientId: string,
    archType: 'adult' | 'child' = 'adult'
): Promise<IOdontogram> => {
    await db.connect()

    try {
        // Try to find existing odontogram
        let odontogram = await Odontogram.findOne({ patientId })

        if (!odontogram) {
            const defaultTeeth = createCompleteTeethSet()
            const now = new Date()

            const initialState: ITeethState = {
                teeth: defaultTeeth,
                savedAt: now
            }

            // Create new odontogram with identical initial and current states
            const newOdontogram = new Odontogram({
                patientId,
                dentalArchType: archType,
                initialState,
                currentState: {
                    ...initialState,
                    lastModified: now
                }
            })

            odontogram = await newOdontogram.save()
        } else {
            const normalizedInitialTeeth = ensureTeethSet(odontogram.initialState?.teeth)
            const normalizedCurrentTeeth = ensureTeethSet(odontogram.currentState?.teeth)

            const initialChanged = normalizedInitialTeeth.length !== odontogram.initialState.teeth.length
            const currentChanged = normalizedCurrentTeeth.length !== odontogram.currentState.teeth.length

            if (initialChanged || currentChanged) {
                odontogram.initialState.teeth = normalizedInitialTeeth
                odontogram.currentState.teeth = normalizedCurrentTeeth
                odontogram.markModified('initialState.teeth')
                odontogram.markModified('currentState.teeth')
                odontogram = await odontogram.save()
            }
        }

        await db.disconnect()
        return odontogram.toObject() as IOdontogram
    } catch (error) {
        await db.disconnect()
        throw error
    }
}

/**
 * Update only the current state of an odontogram
 * Never modifies the initialState
 */
export const updateOdontogramCurrentState = async (
    odontogramId: string,
    currentState: ITeethState,
    userId?: string,
    consultationId?: string
): Promise<IOdontogram> => {
    await db.connect()

    try {
        const updateData: any = {
            'currentState.teeth': currentState.teeth,
            'currentState.lastModified': new Date()
        }

        if (userId) {
            updateData['currentState.lastModifiedBy'] = userId
        }

        if (consultationId) {
            updateData.consultationId = consultationId
        }

        const updatedOdontogram = await Odontogram.findByIdAndUpdate(
            odontogramId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean()

        await db.disconnect()

        if (!updatedOdontogram) {
            throw new Error('Odontogram not found')
        }

        return updatedOdontogram as IOdontogram
    } catch (error) {
        await db.disconnect()
        throw error
    }
}

/**
 * Calculate changes between initial and current states
 */
export const calculateOdontogramChanges = (
    initialState: ITeethState,
    currentState: ITeethState
): IChange[] => {
    const changes: IChange[] = []

    // Create maps for easier lookup
    const initialTeethMap = new Map(
        initialState.teeth.map(tooth => [tooth.toothNumber, tooth])
    )
    // Check all teeth in current state
    currentState.teeth.forEach(currentTooth => {
        const initialTooth = initialTeethMap.get(currentTooth.toothNumber)

        if (!initialTooth) return

        // Check status changes
        if (currentTooth.status !== initialTooth.status) {
            changes.push({
                toothNumber: currentTooth.toothNumber,
                field: 'status',
                oldValue: initialTooth.status,
                newValue: currentTooth.status
            })
        }

        // Check face changes
        currentTooth.faces.forEach((currentFace, index) => {
            const initialFace = initialTooth.faces[index]
            
            if (initialFace && currentFace.state !== initialFace.state) {
                changes.push({
                    toothNumber: currentTooth.toothNumber,
                    field: 'face',
                    facePosition: currentFace.position,
                    oldValue: initialFace.state,
                    newValue: currentFace.state
                })
            }
        })
    })

    return changes
}

/**
 * Compare initial vs current state and return detailed comparison
 */
export const compareOdontogramStates = async (
    patientId: string
): Promise<IComparisonResult> => {
    await db.connect()

    try {
        const odontogram = await Odontogram.findOne({ patientId }).lean()

        if (!odontogram) {
            throw new Error('Odontogram not found for patient')
        }

        const changes = calculateOdontogramChanges(
            odontogram.initialState,
            odontogram.currentState
        )

        // Calculate summary statistics
        const teethModified = new Set(changes.map(c => c.toothNumber)).size
        const facesChanged = changes.filter(c => c.field === 'face').length
        const extractionsAdded = changes.filter(
            c => c.field === 'status' && c.newValue === 'extraction'
        ).length
        const extractionsRemoved = changes.filter(
            c => c.field === 'status' && c.oldValue === 'extraction'
        ).length

        await db.disconnect()

        return {
            initialState: odontogram.initialState,
            currentState: odontogram.currentState,
            changes,
            summary: {
                teethModified,
                facesChanged,
                extractionsAdded,
                extractionsRemoved
            }
        }
    } catch (error) {
        await db.disconnect()
        throw error
    }
}

/**
 * Sync odontogram with consultation treatments
 * Updates current state based on consultation details
 */
export const syncOdontogramWithConsultation = async (
    consultationId: string,
    patientId: string,
    treatments: Array<{
        toothNumber: number;
        facePosition: string;
        treatment: string;
        color: string;
    }>,
    userId?: string
): Promise<IOdontogram> => {
    await db.connect()

    try {
        const odontogram = await Odontogram.findOne({ patientId })

        if (!odontogram) {
            throw new Error('Odontogram not found for patient')
        }

        // Update current state with treatments
        const updatedTeeth = odontogram.currentState.teeth.map(tooth => {
            const toothTreatments = treatments.filter(
                t => t.toothNumber === tooth.toothNumber
            )

            if (toothTreatments.length === 0) return tooth

            // Apply treatments to faces
            const updatedFaces = tooth.faces.map(face => {
                const faceTreatment = toothTreatments.find(
                    t => t.facePosition === face.position
                )

                if (faceTreatment) {
                    return {
                        ...face,
                        state: faceTreatment.color,
                        treatment: faceTreatment.treatment
                    }
                }

                return face
            })

            return {
                ...tooth,
                faces: updatedFaces
            }
        })

        odontogram.currentState.teeth = updatedTeeth
        odontogram.currentState.lastModified = new Date()
        if (userId) {
            odontogram.currentState.lastModifiedBy = userId as any
        }
        odontogram.consultationId = consultationId as any

        const savedOdontogram = await odontogram.save()

        await db.disconnect()
        return savedOdontogram.toObject() as IOdontogram
    } catch (error) {
        await db.disconnect()
        throw error
    }
}

/**
 * Validate tooth number for dental arch type
 */
export const validateToothNumber = (
    toothNumber: number,
    archType: 'adult' | 'child'
): boolean => {
    const validTeeth: readonly number[] = archType === 'adult' ? ADULT_TEETH : CHILD_TEETH
    return (validTeeth as number[]).includes(toothNumber)
}
