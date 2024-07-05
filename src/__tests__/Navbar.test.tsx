import { render, screen } from '@testing-library/react'

import { Navbar } from '@/components'

describe('Navbar component', () => {
    it('renders Navbar component', () => {
        render(<Navbar />)
        const navbarElement = screen.getByText(/Navbar/i)
        expect(navbarElement).toBeInTheDocument()
    })

})