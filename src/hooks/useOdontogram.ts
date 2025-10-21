import { useState, useEffect, useCallback, useMemo } from 'react'

import { saludentisApi } from '@/api'
import { IOdontogram, ITeethState, ITooth, IComparisonResult } from '@/interfaces'
import { showToast } from '@/utils'

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

interface UseOdontogramReturn {
    odontogram: IOdontogram | null
    loading: boolean
    saving: boolean
    error: string | null
    lastSaved: Date | null
    hasChanges: boolean
    updateTooth: (toothNumber: number, updates: Partial<ITooth>) => void
    updateFace: (toothNumber: number, faceIndex: number, state: string, treatment: string) => void
    toggleTooth: (toothNumber: number) => void
    setExtraction: (toothNumber: number) => void
    initialState: ITeethState | null
    currentState: ITeethState | null
    comparison: IComparisonResult | null
    loadComparison: () => Promise<void>
    manualSave: () => Promise<void>
}

export const useOdontogram = (patientId: string): UseOdontogramReturn => {
    const [odontogram, setOdontogram] = useState<IOdontogram | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasChanges, setHasChanges] = useState(false)
    const [comparison, setComparison] = useState<IComparisonResult | null>(null)

    // Load odontogram on mount
    useEffect(() => {
        if (!patientId) return

        const loadOdontogram = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await saludentisApi({
                    url: `/odontogram?patientId=${patientId}`,
                    method: 'GET'
                })
                const data = await response.json()
                
                if (data.ok) {
                    setOdontogram(data.data)
                    setLastSaved(new Date(data.data.updatedAt))
                } else {
                    setError(data.message || 'Error al cargar el odontograma')
                }
            } catch (err: any) {
                console.error('Error loading odontogram:', err)
                setError(err.message || 'Error al cargar el odontograma')
                showToast('Error al cargar el odontograma', 'error')
            } finally {
                setLoading(false)
            }
        }

        loadOdontogram()
    }, [patientId])

    // Save function
    const saveOdontogram = useCallback(async (currentState: ITeethState) => {
        if (!odontogram?._id) return

        setSaving(true)
        setError(null)

        try {
            const response = await saludentisApi({
                url: `/odontogram/${odontogram._id}`,
                method: 'PUT',
                data: { currentState }
            })
            const data = await response.json()

            if (data.ok) {
                setOdontogram(data.data)
                setLastSaved(new Date())
                setHasChanges(false)
            } else {
                setError(data.message || 'Error al guardar el odontograma')
                showToast('Error al guardar el odontograma', 'error')
            }
        } catch (err: any) {
            console.error('Error saving odontogram:', err)
            setError(err.message || 'Error al guardar el odontograma')
            showToast('Error al guardar el odontograma', 'error')
        } finally {
            setSaving(false)
        }
    }, [odontogram?._id])

    // Debounced save (500ms delay)
    const debouncedSave = useMemo(
        () => debounce(saveOdontogram, 500),
        [saveOdontogram]
    )

    // Manual save function (no debounce)
    const manualSave = useCallback(async () => {
        if (!odontogram?.currentState) return
        await saveOdontogram(odontogram.currentState)
    }, [odontogram?.currentState, saveOdontogram])

    // Update tooth helper
    const updateCurrentState = useCallback((updater: (teeth: ITooth[]) => ITooth[]) => {
        if (!odontogram) return

        const updatedTeeth = updater([...odontogram.currentState.teeth])
        
        const newCurrentState: ITeethState = {
            ...odontogram.currentState,
            teeth: updatedTeeth,
            lastModified: new Date()
        }

        setOdontogram(prev => prev ? {
            ...prev,
            currentState: newCurrentState
        } : null)

        setHasChanges(true)
        debouncedSave(newCurrentState)
    }, [odontogram, debouncedSave])

    // Update entire tooth
    const updateTooth = useCallback((toothNumber: number, updates: Partial<ITooth>) => {
        updateCurrentState(teeth => 
            teeth.map(tooth => 
                tooth.toothNumber === toothNumber 
                    ? { ...tooth, ...updates }
                    : tooth
            )
        )
    }, [updateCurrentState])

    // Update specific face
    const updateFace = useCallback((
        toothNumber: number, 
        faceIndex: number, 
        state: string, 
        treatment: string
    ) => {
        updateCurrentState(teeth => 
            teeth.map(tooth => {
                if (tooth.toothNumber !== toothNumber) return tooth

                const updatedFaces = tooth.faces.map((face, index) => 
                    index === faceIndex 
                        ? { ...face, state, treatment }
                        : face
                )

                return { ...tooth, faces: updatedFaces }
            })
        )
    }, [updateCurrentState])

    // Toggle tooth presence
    const toggleTooth = useCallback((toothNumber: number) => {
        updateCurrentState(teeth => 
            teeth.map(tooth => 
                tooth.toothNumber === toothNumber 
                    ? { ...tooth, status: !tooth.status }
                    : tooth
            )
        )
    }, [updateCurrentState])

    // Set tooth as extraction
    const setExtraction = useCallback((toothNumber: number) => {
        updateCurrentState(teeth => 
            teeth.map(tooth => 
                tooth.toothNumber === toothNumber 
                    ? { ...tooth, status: 'extraction' as const }
                    : tooth
            )
        )
    }, [updateCurrentState])

    // Load comparison
    const loadComparison = useCallback(async () => {
        if (!patientId) return

        try {
            const response = await saludentisApi({
                url: `/odontogram/compare/${patientId}`,
                method: 'GET'
            })
            const data = await response.json()
            
            if (data.ok) {
                setComparison(data.data)
            } else {
                showToast('Error al cargar la comparación', 'error')
            }
        } catch (err: any) {
            console.error('Error loading comparison:', err)
            showToast('Error al cargar la comparación', 'error')
        }
    }, [patientId])

    return {
        odontogram,
        loading,
        saving,
        error,
        lastSaved,
        hasChanges,
        updateTooth,
        updateFace,
        toggleTooth,
        setExtraction,
        initialState: odontogram?.initialState || null,
        currentState: odontogram?.currentState || null,
        comparison,
        loadComparison,
        manualSave
    }
}