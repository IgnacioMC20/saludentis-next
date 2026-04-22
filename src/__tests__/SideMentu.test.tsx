import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/router'

import { SideMenu } from '@/components'
import { AuthContext, UIContext } from '@/context'

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

describe('SideMenu', () => {
    const toggleSideMenu = jest.fn()
    const logoutUser = jest.fn()
    const mockPush = jest.fn()

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            pathname: '/',
            asPath: '/',
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    const renderWithProviders = () => {
        return render(
            <UIContext.Provider value={{ isMenuOpen: false, toggleSideMenu, isModalOpen: false, toggleModal: jest.fn() }}>
                <AuthContext.Provider value={{ isLoggedIn: false, logoutUser }}>
                    <SideMenu />
                </AuthContext.Provider>
            </UIContext.Provider>
        )
    }

    it('renders the SideMenu component', () => {
        renderWithProviders()
        expect(screen.getByText('Pacientes')).toBeInTheDocument()
    })

    it('calls toggleSideMenu when a menu item is clicked', () => {
        renderWithProviders()
        const menuItem = screen.getAllByText('Pacientes')[0]
        fireEvent.click(menuItem)
        expect(mockPush).toHaveBeenCalledWith('/pacientes')
    })

    it('calls logoutUser when "Salir" is clicked', () => {
        renderWithProviders()
        const logoutButton = screen.getByText('Salir')
        fireEvent.click(logoutButton)
        expect(logoutUser).toHaveBeenCalled()
    })
})
