
export * from './user'
export * from './patient'
export * from './treatment'
export * from './disease'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}