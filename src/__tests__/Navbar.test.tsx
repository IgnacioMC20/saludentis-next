import { ThemeProvider, createTheme } from '@mui/material/styles'
import { fireEvent, render, screen } from '@testing-library/react'

import { Navbar } from '@/components'

describe('Navbar component', () => {
    const theme = createTheme()
    it('renders Navbar component', () => {
        
        render(
            <ThemeProvider theme={theme}>
                <Navbar />
            </ThemeProvider>
        )
        
        const logo = screen.getByAltText('Saludentis logo')
        expect(logo).toBeInTheDocument()
  })
// TODO: Fix this test
//   it('opens and closes nav menu', () => {
//     render(
//         <ThemeProvider theme={theme}>
//             <Navbar />
//         </ThemeProvider>
//     )

//     const menuButton = screen.getByRole('button', { name: /account of current user/i })
//     fireEvent.click(menuButton)

//     const menu = screen.getByRole('menu')
//     expect(menu).toBeInTheDocument()

//     // fireEvent.click(document.body) // Close the menu by clicking outside
//     // expect(menu).not.toBeInTheDocument()
// })

it('opens and closes user menu', () => {
    render(
        <ThemeProvider theme={theme}>
            <Navbar />
        </ThemeProvider>
    )

    const avatarButton = screen.getByRole('button', { name: /open settings/i })
    fireEvent.click(avatarButton)

    const userMenu = screen.getByRole('menu')
    expect(userMenu).toBeInTheDocument()

    const menuItem = screen.getByText(/Profile/i)
        fireEvent.click(menuItem)
        expect(userMenu).not.toBeVisible()
})

})