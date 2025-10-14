import { IPatient } from '@/models/Patient'

interface Props {
    url: string
    baseUrl?: string
    method?: Action
    data?: IPatient | any // todo: add order types
}

type Action = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const saludentisApi = async ({ baseUrl = '/api', url, method = 'GET', data }: Props) => {

    if (method == 'GET') return await fetch(baseUrl + url)
    else {
        const response = await fetch(baseUrl + url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response
    }
}
