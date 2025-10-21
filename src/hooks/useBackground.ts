import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IBackground } from '@/models/Background'
import { showToast } from '@/utils'

export interface BackgroundResponse {
    ok: boolean;
    data?: IBackground | null;
    message: string;
    errors?: any;
}

export interface CreateBackgroundResponse {
    ok: boolean;
    data?: IBackground;
    message: string;
    errors?: any;
}

export interface UpdateBackgroundResponse {
    ok: boolean;
    data?: IBackground;
    message: string;
    errors?: any;
}

// Hook to get background/clinic history by patient ID
export const useBackground = (patientId: string = '') => {
    return useQuery<BackgroundResponse, Error>({
        queryKey: ['background', patientId],
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        retry: 2, // Retry fetching the data twice on failure
        enabled: !!patientId, // Only fetch if patient ID exists
        queryFn: async () => {
            const response = await saludentisApi({ url: `/background/${patientId}` })
            const data = await response.json()
            return data
        },
    })
}

// Hook to create a new background/clinic history
export const useCreateBackground = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateBackgroundResponse, Error, IBackground>({
        mutationFn: async (backgroundData: IBackground) => {
            const patientId = backgroundData.patientId.toString()
            const response = await saludentisApi({
                url: `/background/${patientId}`,
                method: 'POST',
                data: backgroundData
            })
            const data = await response.json()
            return data
        },
        onSuccess: (data) => {
            // Invalidate background query to refetch data
            if (data.data?.patientId) {
                const patientId = data.data.patientId.toString()
                queryClient.invalidateQueries({ queryKey: ['background', patientId] })
            }
        },
        onError: (error) => {
            console.error('Error creating background:', error)
            showToast('Error al crear el historial clínico. Por favor, intente nuevamente.', 'error')
        }
    })
}

// Hook to update an existing background/clinic history
export const useUpdateBackground = (patientId: string) => {
    const queryClient = useQueryClient()

    return useMutation<UpdateBackgroundResponse, Error, Partial<IBackground>>({
        mutationFn: async (backgroundData: Partial<IBackground>) => {
            const response = await saludentisApi({
                url: `/background/${patientId}`,
                method: 'PUT',
                data: backgroundData
            })
            const data = await response.json()
            return data
        },
        onSuccess: () => {
            // Invalidate background query to refetch data
            queryClient.invalidateQueries({ queryKey: ['background', patientId] })
        },
        onError: (error) => {
            console.error('Error updating background:', error)
            showToast('Error al actualizar el historial clínico. Por favor, intente nuevamente.', 'error')
        }
    })
}