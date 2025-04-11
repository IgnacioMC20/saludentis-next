import { useQuery } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { IBalance } from '@/models/Balance'
import { ApiResponse } from '@/pages/api/patient/[id]'

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
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!patientId, // Only fetch if patient ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/patient/balance/${patientId}` })
                const data = await response.json()
                return data
            },
        }
    )
    return balanceQuery
}
