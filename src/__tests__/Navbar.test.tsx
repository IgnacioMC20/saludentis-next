import { ThemeProvider } from '@mui/material/styles'
import { fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'

import { Navbar } from '@/components'
import { AuthContext, UIContext } from '@/context'
import { lightTheme } from '@/themes'
const mockToggleSideMenu = jest.fn()
const mockLogoutUser = jest.fn()

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Navbar component', () => {
    beforeEach(() => {
        return mockedUseRouter.mockReturnValue({
            route: '/',
            pathname: '',
            query: {},
            asPath: '',
            push: jest.fn(),
            replace: jest.fn(),
            reload: jest.fn(),
            back: jest.fn(),
            prefetch: jest.fn(),
            beforePopState: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
                emit: jest.fn(),
            },
            isFallback: false,
            basePath: '',
            isLocaleDomain: false,
            forward: function (): void {
                throw new Error('Function not implemented.')
            },
            isReady: false,
            isPreview: false
        })
    })
    const uiContextValue = {
        toggleSideMenu: mockToggleSideMenu,
        isMenuOpen: false,
    }

    const authContextValue = {
        isLoggedIn: false,
        // eslint-disable-next-line
        loginUser: async (email: string, password: string) => {
            return true
        },
        logoutUser: mockLogoutUser,
    }

    it('opens and closes side menu', () => {
        render(
            <ThemeProvider theme={lightTheme}>
                <UIContext.Provider value={uiContextValue}>
                    <AuthContext.Provider value={authContextValue}>
                        <Navbar />
                    </AuthContext.Provider>
                </UIContext.Provider>
            </ThemeProvider>
        )

        const menuButton = screen.getByRole('button', { name: /account of current user/i })
        fireEvent.click(menuButton)
        expect(mockToggleSideMenu).toHaveBeenCalled()
    })
})