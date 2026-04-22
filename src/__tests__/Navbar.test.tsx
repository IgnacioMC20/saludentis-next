import { ThemeProvider } from '@mui/material/styles'
import { fireEvent, render, screen } from '@testing-library/react'

import { Navbar } from '@/components'
import { UIContext } from '@/context'
import { lightTheme } from '@/themes'
const mockToggleSideMenu = jest.fn()

describe('Navbar component', () => {
    const uiContextValue = {
        toggleSideMenu: mockToggleSideMenu,
        isMenuOpen: false,
        isModalOpen: false,
        toggleModal: jest.fn(),
    }

    it('opens and closes side menu', () => {
        render(
            <ThemeProvider theme={lightTheme}>
                <UIContext.Provider value={uiContextValue}>
                    <Navbar />
                </UIContext.Provider>
            </ThemeProvider>
        )

        const menuButton = screen.getByRole('button', { name: /abrir navegación/i })
        fireEvent.click(menuButton)
        expect(mockToggleSideMenu).toHaveBeenCalled()
    })
})
