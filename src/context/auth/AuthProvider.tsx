import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
// import { useSession, signOut } from 'next-auth/react'
import { FC, useReducer, useEffect } from 'react'
import { toast } from 'react-toastify'

import { authReducer, AuthContext } from '.'
// import { tesloApi } from '@/api'
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
    console.log('AuthProvider')
    const router = useRouter()
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    // const router = useRouter()

    // const { data, status } = useSession()

    // useEffect(() => {
    //     if (status === 'authenticated') dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
    // }, [status, data])

    // const checkToken = async () => {
    //     if (!Cookies.get('token')) {
    //         return
    //     }
    //     try {
    //         const data = await tesloApi({ url: '/user/validate-token' })
    //         const { message, token, user } = await data.json()

    //         if (message) {
    //             router.push('/auth/login')
    //             Cookies.remove('token')
    //             return
    //         }
    //         Cookies.set('token', token)
    //         dispatch({ type: '[Auth] - Login', payload: user })

    //     } catch (error) {
    //         Cookies.remove('token')
    //         router.push('/auth/login')
    //     }
    // }

    // //Methods
    const loginUser = async (email: string, password: string): Promise<boolean> => {
        try {
            // login
            console.log('loginUser', { email, password })
            // promise true
            return Promise.resolve(true)
        } catch (error) {

            toast('Contra o correo erroneos', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                theme: 'light',
                type: 'error',
                closeButton: false
            })
            console.log('Error: ', error)
            return Promise.resolve(false)
        }
    }

    const logoutUser = () => {
        Cookies.remove('lastName')
        Cookies.remove('lastName')
        Cookies.remove('firstName')
        console.log('logoutUser')
        router.push('/auth/login')
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            //Methods
            loginUser,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

