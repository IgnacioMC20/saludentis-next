import { createContext } from 'react'

import { IUser } from '@/interfaces'

interface ContextPros {
    isLoggedIn: boolean
    user?: IUser

    //Methods
    // loginUser: (email: string, password: string) => Promise<boolean>
    // registerUser: (email: string, password: string, name: string) => Promise<boolean>
    // logoutUser: () => void
}

export const AuthContext = createContext({} as ContextPros)