import { useQuery } from '@tanstack/react-query'

export const useLabels = () => {

    const labels = useQuery({
        queryKey: ['labels'],
        queryFn: () => console.log('fetching labels'),
        staleTime: 1000 * 60 * 60,
    })
    return labels
}