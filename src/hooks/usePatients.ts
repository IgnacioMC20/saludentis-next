import { useQuery } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { ApiResponse } from '@/pages/api/patient'

export const usePatients = () => {

    const patient = useQuery<ApiResponse, Error>(
        {
            queryKey: ['patients'],
            staleTime: 12 * 5 * 60 * 1000, // Cache data for 60 minutes
            retry: 2, // Retry fetching the data twice on failure
            queryFn: async () => {
                const response = await saludentisApi({ url: '/patient' })
                const data = await response.json()
                return data
            },
        }
    )
    return patient
}
