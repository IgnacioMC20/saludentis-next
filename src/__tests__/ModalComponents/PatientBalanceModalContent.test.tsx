import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import { PatientBalanceModalContent } from '@/components'

jest.mock('react-toastify', () => ({
    toast: jest.fn(),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('PatientBalanceModalContent Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the image and balance correctly', () => {
        render(
            <PatientBalanceModalContent
                patientId="test-patient-id"
                currentBalance={1500}
            />,
            { wrapper: createWrapper() }
        )
        expect(screen.getByAltText('money')).toBeInTheDocument()
        expect(screen.getByText('Saldo: Q. 1,500')).toBeInTheDocument()
    })

    it('renders the input label and button correctly', () => {
        render(
            <PatientBalanceModalContent
                patientId="test-patient-id"
                currentBalance={1500}
            />,
            { wrapper: createWrapper() }
        )
        const amountToPayLabel = screen.getByText('Q.')
        expect(amountToPayLabel).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })
})
