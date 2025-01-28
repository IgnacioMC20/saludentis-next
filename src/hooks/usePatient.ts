import { useQuery } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { ApiResponse } from '@/pages/api/patient/[id]'

export const usePatient = (id: string = '') => {
    console.log('usePatient id:', id)

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
