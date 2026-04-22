import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

import { saludentisApi } from '@/api'
import { IReportFilters, IReportsData } from '@/interfaces/reports'

export interface ReportsResponse {
    data: IReportsData;
    message: string;
    success: boolean;
}

export interface UseReportsParams extends Partial<IReportFilters> {
    page?: number;
    pageSize?: number;
}

const buildQueryString = (params: UseReportsParams) => {
    const query = new URLSearchParams()

    if (params.startDate) query.set('startDate', format(params.startDate, 'yyyy-MM-dd'))
    if (params.endDate) query.set('endDate', format(params.endDate, 'yyyy-MM-dd'))
    if (params.groupBy) query.set('groupBy', params.groupBy)
    if (params.siteName) query.set('siteName', params.siteName)
    if (params.doctorName) query.set('doctorName', params.doctorName)
    if (params.consultationStatus) query.set('consultationStatus', params.consultationStatus)
    if (params.patientSearch) query.set('patientSearch', params.patientSearch)
    if (typeof params.page === 'number') query.set('page', String(params.page))
    if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize))

    return query.toString()
}

export const useReports = (params: UseReportsParams) => {
    return useQuery<ReportsResponse, Error>({
        queryKey: ['reports', params],
        staleTime: 5 * 60 * 1000,
        retry: 2,
        queryFn: async () => {
            const queryString = buildQueryString(params)
            const response = await saludentisApi({ url: `/reports?${queryString}` })
            return response.json()
        },
    })
}
