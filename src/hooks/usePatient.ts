import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IPatient } from '@/interfaces'
import { IBalance } from '@/models/Balance'
import { ApiResponse } from '@/pages/api/patient/[id]'
import { showToast } from '@/utils'

export const usePatient = (id: string = '') => {

    const patient = useQuery<ApiResponse, Error>(
        {
            queryKey: ['patient', `${id}`],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!id, // Only fetch if ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/patient/${id}` })
                const data = await response.json()
                return data
            },
        }
    )
    return patient
}

export interface BalanceResponse {
    balance: IBalance;
    message: string;
    success: boolean;
}

export const useBalance = (patientId: string = '') => {
    const balanceQuery = useQuery<BalanceResponse, Error>(
        {
            queryKey: ['balance', `${patientId}`],
            staleTime: 0, // Always consider data stale to refetch on invalidation
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!patientId, // Only fetch if patient ID exists
            refetchOnMount: true, // Refetch when component mounts
            refetchOnWindowFocus: false, // Don't refetch on window focus
            queryFn: async () => {
                const response = await saludentisApi({ url: `/patient/balance/${patientId}` })
                const data = await response.json()
                return data
            },
        }
    )
    return balanceQuery
}

export interface UpdatePatientResponse {
    ok: boolean;
    data?: IPatient;
    message: string;
    errors?: any;
}

// Hook to update patient information
export const useUpdatePatient = (patientId: string) => {
    const queryClient = useQueryClient()

    return useMutation<UpdatePatientResponse, Error, Partial<IPatient>>({
        mutationFn: async (patientData: Partial<IPatient>) => {
            const response = await saludentisApi({
                url: '/patient',
                method: 'PUT',
                data: patientData
            })
            const data = await response.json()
            return data
        },
        onSuccess: () => {
            // Invalidate patient query to refetch data
            queryClient.invalidateQueries({ queryKey: ['patient', patientId] })
        },
        onError: (error) => {
            console.error('Error updating patient:', error)
            showToast('Error al actualizar la información del paciente. Por favor, intente nuevamente.', 'error')
        }
    })
}
