import { render, screen, waitFor } from '@testing-library/react'

import { Table } from '@/components'

const mockDataPatients = [
    {
        id: '1',
        nombreCompleto: 'John Doe',
        fechaNacimiento: '1990-01-01',
        numeroTelefonico: '123456789',
        button: true,
        edad: '30'
    },
    {
        id: '2',
        nombreCompleto: 'Jane Doe',
        fechaNacimiento: '1985-05-15',
        numeroTelefonico: '987654321',
        button: false,
        edad: '35'
    }
]

describe('Table component', () => {

    it('renders the table with data correctly', async () => {
        render(<Table data={mockDataPatients} progress={false} />)

        expect(screen.getByText('#')).toBeInTheDocument()
        expect(screen.getByText('Nombre Completo')).toBeInTheDocument()
        expect(screen.getByText('Fecha Nacimiento')).toBeInTheDocument()
        expect(screen.getByText('Numero Telefonico')).toBeInTheDocument()
        expect(screen.getByText('Edad')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        })
    })
})
