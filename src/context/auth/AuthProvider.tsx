
import { useSession, signOut } from 'next-auth/react'
import { FC, useReducer, useEffect } from 'react'

import { authReducer, AuthContext } from '.'
import { IUser } from '@/interfaces'

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

    const { data, status } = useSession()
    console.log({ data, status })

    useEffect(() => {
        if (status === 'authenticated') dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        else {
            dispatch({ type: '[Auth] - Logout' })
        }
    }, [status, data])

    const logoutUser = () => {
        signOut()
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            //Methods
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

