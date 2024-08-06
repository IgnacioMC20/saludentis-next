import { render, screen } from '@testing-library/react'

import { PatientBalanceModalContent } from '@/components'

jest.mock('react-toastify', () => ({
    toast: jest.fn(),
}))

describe('PatientBalanceModalContent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the image and balance correctly', () => {
        render(<PatientBalanceModalContent />)
        expect(screen.getByAltText('money')).toBeInTheDocument()
        expect(screen.getByText('Saldo: Q. 1500')).toBeInTheDocument()
    })

    it('renders the input label and button correctly', () => {
        render(<PatientBalanceModalContent />)
        const amountToPayLabel = screen.getByText('Q.')
        expect(amountToPayLabel).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })
})
