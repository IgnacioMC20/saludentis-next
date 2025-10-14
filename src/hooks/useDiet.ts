import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IDiet } from '@/models/Diet'

export interface DietResponse {
    ok: boolean;
    data?: IDiet | null;
    message: string;
    errors?: any;
}

export interface CreateDietResponse {
    ok: boolean;
    data?: IDiet;
    message: string;
    errors?: any;
}

export interface UpdateDietResponse {
    ok: boolean;
    data?: IDiet;
    message: string;
    errors?: any;
}

// Hook to get diet by patient ID
export const useDiet = (patientId: string = '') => {
    return useQuery<DietResponse, Error>({
        queryKey: ['diet', patientId],
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        retry: 2, // Retry fetching the data twice on failure
        enabled: !!patientId, // Only fetch if patient ID exists
        queryFn: async () => {
            const response = await saludentisApi({ url: `/diet/${patientId}` })
            const data = await response.json()
            return data
        },
    })
}

// Hook to create a new diet
export const useCreateDiet = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateDietResponse, Error, IDiet>({
        mutationFn: async (dietData: IDiet) => {
            const response = await saludentisApi({
                url: '/diet',
                method: 'POST',
                data: dietData
            })
            const data = await response.json()
            return data
        },
        onSuccess: (data) => {
            // Invalidate diet query to refetch data
            if (data.data?.patientId) {
                const patientId = data.data.patientId.toString()
                queryClient.invalidateQueries({ queryKey: ['diet', patientId] })
            }
        },
        onError: (error) => {
        }
    })
}

// Hook to update an existing diet
export const useUpdateDiet = (patientId: string) => {
    const queryClient = useQueryClient()

    return useMutation<UpdateDietResponse, Error, Partial<IDiet>>({
        mutationFn: async (dietData: Partial<IDiet>) => {
            const response = await saludentisApi({
                url: `/diet/${patientId}`,
                method: 'PUT',
                data: dietData
            })
            const data = await response.json()
            return data
        },
        onSuccess: () => {
            // Invalidate diet query to refetch data
            queryClient.invalidateQueries({ queryKey: ['diet', patientId] })
        },
        onError: (error) => {
        }
    })
}