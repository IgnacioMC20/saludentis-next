import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IConsultation } from '@/models/Consultation'

export interface ConsultationResponse {
    consultation: IConsultation;
    message: string;
    ok: boolean;
}

export interface ConsultationsResponse {
    data: IConsultation[];
    ok: boolean;
    message?: string;
}

export interface CreateConsultationResponse {
    ok: boolean;
    data?: IConsultation;
    message: string;
    errors?: any;
}

// Hook to get all consultations or consultations by patient ID
export const useConsultations = (patientId?: string) => {
    const queryKey = patientId ? ['consultations', patientId] : ['consultations']
    const url = patientId ? `/consultation?patientId=${patientId}` : '/consultation'

    return useQuery<ConsultationsResponse, Error>(
        {
            queryKey,
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            queryFn: async () => {
                const response = await saludentisApi({ url })
                const data = await response.json()
                return data
            },
        }
    )
}

// Hook to get a specific consultation by ID
export const useConsultation = (id: string = '') => {
    return useQuery<ConsultationResponse, Error>(
        {
            queryKey: ['consultation', id],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!id, // Only fetch if ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/consultation/${id}` })
                const data = await response.json()
                return data
            },
        }
    )
}

// Hook to create a new consultation
export const useCreateConsultation = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateConsultationResponse, Error, IConsultation>(
        {
            mutationFn: async (consultationData: IConsultation) => {
                const response = await saludentisApi({
                    url: '/consultation',
                    method: 'POST',
                    data: consultationData
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate consultations queries to refetch data
                queryClient.invalidateQueries({ queryKey: ['consultations'] })
                
                // Invalidate all balance queries to ensure the appointment history updates
                queryClient.invalidateQueries({ queryKey: ['balance'] })
                queryClient.invalidateQueries({ queryKey: ['reports'] })
            }
        }
    )
}

// Hook to update a consultation
export const useUpdateConsultation = (id: string) => {
    const queryClient = useQueryClient()

    return useMutation<ConsultationResponse, Error, IConsultation>(
        {
            mutationFn: async (consultationData: IConsultation) => {
                const response = await saludentisApi({
                    url: `/consultation/${id}`,
                    method: 'PUT',
                    data: consultationData
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate specific consultation query and consultations list
                queryClient.invalidateQueries({ queryKey: ['consultation', id] })
                queryClient.invalidateQueries({ queryKey: ['consultations'] })
                
                // Invalidate all balance queries
                queryClient.invalidateQueries({ queryKey: ['balance'] })
                queryClient.invalidateQueries({ queryKey: ['reports'] })
            }
        }
    )
}

// Hook to delete a consultation
export const useDeleteConsultation = () => {
    const queryClient = useQueryClient()

    return useMutation<{ message: string, ok: boolean }, Error, string>(
        {
            mutationFn: async (consultationId: string) => {
                const response = await saludentisApi({
                    url: `/consultation/${consultationId}`,
                    method: 'DELETE'
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate consultations queries to refetch data
                queryClient.invalidateQueries({ queryKey: ['consultations'] })
                
                // Invalidate all balance queries since we don't have patientId in delete response
                queryClient.invalidateQueries({ queryKey: ['balance'] })
                queryClient.invalidateQueries({ queryKey: ['reports'] })
            }
        }
    )
}
