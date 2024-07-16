
import { createContext } from 'react'

import { IUser } from '@/interfaces'

interface ContextPros {
    isLoggedIn: boolean
    user?: IUser

    //Methods
    // eslint-disable-next-line no-unused-vars
    logoutUser: () => void
    // registerUser: (email: string, password: string, name: string) => Promise<boolean>
}

export const AuthContext = createContext({} as ContextPros)