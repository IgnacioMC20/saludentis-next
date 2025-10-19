import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'

import { usePatient } from '../../hooks'
import PacientInfo from '@/components/PatientComponents/PacientInfo'
import '@testing-library/jest-dom'

// Mock 'next/router'
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../hooks', () => ({
  usePatient: jest.fn(),
}))

describe('PatientInfo component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/pacientes/nuevo',
      query: { id: '123' }
    })

      // Mock de la respuesta de usePatient
      ; (usePatient as jest.Mock).mockReturnValue({
        data: { ok: true, data: [] },
        isLoading: false,
      })
  })

  it('should render the PacientInfo component', async () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <PacientInfo />
      </QueryClientProvider>
    )

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Segundo Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument()
    expect(screen.getByLabelText('CUI/DPI')).toBeInTheDocument()
    expect(screen.getByLabelText('Edad')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument()
    expect(screen.getByText('Sexo')).toBeInTheDocument()
    expect(screen.getByText('Estado Civil')).toBeInTheDocument()
    expect(screen.getByLabelText('Ocupación')).toBeInTheDocument()
    expect(screen.getByLabelText('Última visita')).toBeInTheDocument()
    expect(screen.getByLabelText('Último tratamiento')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('should not render the PacientInfo component', async () => {
    ; (usePatient as jest.Mock).mockReturnValue({
      data: { ok: true, data: [] },
      isLoading: true,
    })

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <PacientInfo />
      </QueryClientProvider>
    )

    expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument()

  })
})
