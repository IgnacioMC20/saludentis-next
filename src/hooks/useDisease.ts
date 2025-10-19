import { useQuery } from '@tanstack/react-query'

import { saludentisApi } from '@/api'
import { ApiResponse } from '@/interfaces'
import { delay } from '@/utils'

export const useDisease = (id: string = '') => {

    const disease = useQuery<ApiResponse, Error>(
        {
            queryKey: ['disease', `${id}`],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure
            enabled: !!id, // Only fetch if ID exists
            queryFn: async () => {
                const response = await saludentisApi({ url: `/disease/${id}` })
                const data = await response.json()
                return data
            },
        }
    )
    return disease
}

export const useDiseases = () => {
    const disease = useQuery<ApiResponse, Error>(
        {
            queryKey: ['diseases'],
            staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
            retry: 2, // Retry fetching the data twice on failure

            queryFn: async () => {
                const response = await saludentisApi({ url: '/disease' })
                await delay(500)
                const data = await response.json()
                return data
            },
        }
    )
    return disease
}
