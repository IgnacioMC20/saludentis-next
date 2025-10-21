
export * from './user'
export * from './patient'
export * from './treatment'
export * from './disease'
export * from './reports'
export * from './odontogram'

export interface ApiResponse<T = any> {
    ok: boolean
    data?: T
    message?: string
    errors?: any
}