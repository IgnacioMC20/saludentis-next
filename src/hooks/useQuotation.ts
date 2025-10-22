import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IQuotation } from '@/models/Quotation'

export interface QuotationResponse {
    quotation: IQuotation;
    message: string;
    ok: boolean;
}

export interface QuotationsResponse {
    data: IQuotation[];
    ok: boolean;
    message?: string;
}

export interface CreateQuotationResponse {
    ok: boolean;
    data?: IQuotation;
    message: string;
    errors?: any;
}

// Hook to get all quotations or quotations by patient ID
export const useQuotations = (patientId?: string) => {
    const queryKey = patientId ? ['quotations', patientId] : ['quotations']
    const url = patientId ? `/quotation?patientId=${patientId}` : '/quotation'

    return useQuery<QuotationsResponse, Error>(
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

// Hook to get a specific quotation by ID
export const useQuotation = (id: string = '') => {
    return useQuery<QuotationResponse, Error>(
        {
            queryKey: ['quotation', id],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!id, // Only fetch if ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/quotation/${id}` })
                const data = await response.json()
                return data
            },
        }
    )
}

// Hook to create a new quotation
export const useCreateQuotation = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateQuotationResponse, Error, IQuotation>(
        {
            mutationFn: async (quotationData: IQuotation) => {
                const response = await saludentisApi({
                    url: '/quotation',
                    method: 'POST',
                    data: quotationData
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate quotations queries to refetch data
                queryClient.invalidateQueries({ queryKey: ['quotations'] })
            }
        }
    )
}

// Hook to update a quotation
export const useUpdateQuotation = (id: string) => {
    const queryClient = useQueryClient()

    return useMutation<QuotationResponse, Error, IQuotation>(
        {
            mutationFn: async (quotationData: IQuotation) => {
                const response = await saludentisApi({
                    url: `/quotation/${id}`,
                    method: 'PUT',
                    data: quotationData
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate specific quotation query and quotations list
                queryClient.invalidateQueries({ queryKey: ['quotation', id] })
                queryClient.invalidateQueries({ queryKey: ['quotations'] })
            }
        }
    )
}

// Hook to delete a quotation
export const useDeleteQuotation = () => {
    const queryClient = useQueryClient()

    return useMutation<{ message: string, ok: boolean }, Error, string>(
        {
            mutationFn: async (quotationId: string) => {
                const response = await saludentisApi({
                    url: `/quotation/${quotationId}`,
                    method: 'DELETE'
                })
                const data = await response.json()
                return data
            },
            onSuccess: () => {
                // Invalidate quotations queries to refetch data
                queryClient.invalidateQueries({ queryKey: ['quotations'] })
            }
        }
    )
}