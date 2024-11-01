import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import React from 'react'

import PacientInfo from '@/components/PatientComponents/PacientInfo'
import '@testing-library/jest-dom'

// Mock del módulo 'next/router'
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('PatientInfo component', () => {
  beforeEach(() => {
    // Definimos el mock de useRouter para especificar el pathname
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/pacientes/nuevo', // o cualquier ruta que necesites
    })
  })
  // TODO: Fix the test
  it('should render the PacientInfo component', () => {
    render(<PacientInfo />)
    expect(screen.getByLabelText('Nombres')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument()
    expect(screen.getByLabelText('CUI/DPI')).toBeInTheDocument()
    // expect(screen.getByLabelText('Edad')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument()
    // expect(screen.getByLabelText('Sexo')).toBeInTheDocument()
    // expect(screen.getByLabelText('Estado Civil')).toBeInTheDocument()
    expect(screen.getByLabelText('Ocupación')).toBeInTheDocument()
    expect(screen.getByLabelText('Última visita')).toBeInTheDocument()
    // expect(screen.getByLabelText('Fecha')).toBeInTheDocument()
    // expect(screen.getByLabelText('Motivo de la consulta')).toBeInTheDocument()
    expect(screen.getByLabelText('Último tratamiento')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })
})
