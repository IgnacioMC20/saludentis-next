import { ThemeProvider } from '@mui/material/styles'
import { fireEvent, render, screen } from '@testing-library/react'

import { Navbar } from '@/components'
import { AuthContext, UIContext } from '@/context'
import { lightTheme } from '@/themes'
const mockToggleSideMenu = jest.fn()
const mockLogoutUser = jest.fn()

describe('Navbar component', () => {
    const uiContextValue = {
        toggleSideMenu: mockToggleSideMenu,
        isMenuOpen: false,
    }

    const authContextValue = {
        isLoggedIn: false,
        // eslint-disable-next-line
        loginUser: async (email: string, password: string) => {
            // Implement your login logic here
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