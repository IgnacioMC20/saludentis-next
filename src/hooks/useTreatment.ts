import { useQuery } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { ApiResponse } from '@/interfaces'
import { delay } from '@/utils'

export const useTreatment = (id: string = '') => {

    const treatment = useQuery<ApiResponse, Error>(
        {
            queryKey: ['treatment', `${id}`],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!id, // Only fetch if ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/treatment/${id}` })
                const data = await response.json()
                return data
            },
        }
    )
    return treatment
}

export const useTreatments = () => {
    const treatments = useQuery<ApiResponse, Error>(
        {
            queryKey: ['treatments'],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure

            queryFn: async () => {
                const response = await saludentisApi({ url: '/treatment' })
                await delay(500)
                const data = await response.json()
                return data
            },
        }
    )
    return treatments
}
