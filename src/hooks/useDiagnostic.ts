import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IDiagnostic } from '@/models/Diagnostic'

export interface DiagnosticResponse {
    ok: boolean;
    data?: IDiagnostic | null;
    message: string;
    errors?: any;
}

export interface CreateDiagnosticResponse {
    ok: boolean;
    data?: IDiagnostic;
    message: string;
    errors?: any;
}

export interface UpdateDiagnosticResponse {
    ok: boolean;
    data?: IDiagnostic;
    message: string;
    errors?: any;
}

// Hook to get diagnostic by patient ID
export const useDiagnostic = (patientId: string = '') => {
    return useQuery<DiagnosticResponse, Error>({
        queryKey: ['diagnostic', patientId],
        staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
        retry: 2, // Retry fetching the data twice on failure
        enabled: !!patientId, // Only fetch if patient ID exists
        queryFn: async () => {
            const response = await saludentisApi({ url: `/diagnostic/${patientId}` })
            const data = await response.json()
            return data
        },
    })
}

// Hook to create a new diagnostic
export const useCreateDiagnostic = () => {
    const queryClient = useQueryClient()

    return useMutation<CreateDiagnosticResponse, Error, IDiagnostic>({
        mutationFn: async (diagnosticData: IDiagnostic) => {
            const response = await saludentisApi({
                url: '/diagnostic',
                method: 'POST',
                data: diagnosticData
            })
            const data = await response.json()
            return data
        },
        onSuccess: (data) => {
            // Invalidate diagnostic query to refetch data
            if (data.data?.patientId) {
                const patientId = data.data.patientId.toString()
                queryClient.invalidateQueries({ queryKey: ['diagnostic', patientId] })
            }
        },
        onError: (error) => {
        }
    })
}

// Hook to update an existing diagnostic
export const useUpdateDiagnostic = (patientId: string) => {
    const queryClient = useQueryClient()

    return useMutation<UpdateDiagnosticResponse, Error, Partial<IDiagnostic>>({
        mutationFn: async (diagnosticData: Partial<IDiagnostic>) => {
            const response = await saludentisApi({
                url: `/diagnostic/${patientId}`,
                method: 'PUT',
                data: diagnosticData
            })
            const data = await response.json()
            return data
        },
        onSuccess: () => {
            // Invalidate diagnostic query to refetch data
            queryClient.invalidateQueries({ queryKey: ['diagnostic', patientId] })
        },
        onError: (error) => {
        }
    })
}