import { render, screen } from '@testing-library/react'
import React from 'react'

import PacientInfo from '@/components/PatientComponents/PacientInfo' // Asegúrate de que la ruta sea correcta
import '@testing-library/jest-dom'

describe('PatientInfo component', () => {
  it('should render the PacientInfo component', () => {
    render(<PacientInfo />)

    // Verifica que el título principal exista
    // expect(screen.getByText('Datos personales')).toBeInTheDocument()

    // Verifica que los campos de texto se renderizan correctamente
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha de Nacimiento')).toBeInTheDocument()
    expect(screen.getByLabelText('CUI')).toBeInTheDocument()
    expect(screen.getByLabelText('Edad')).toBeInTheDocument()
    expect(screen.getByLabelText('Teléfono')).toBeInTheDocument()
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument()
    expect(screen.getByLabelText('Sexo')).toBeInTheDocument()
    expect(screen.getByLabelText('Estado Civil')).toBeInTheDocument()
    expect(screen.getByLabelText('Ocupación')).toBeInTheDocument()
    expect(screen.getByLabelText('Última visita')).toBeInTheDocument()
    expect(screen.getByLabelText('Fecha')).toBeInTheDocument()
    expect(screen.getByLabelText('Motivo de la consulta')).toBeInTheDocument()
    expect(screen.getByLabelText('Último tratamiento')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()

    // Verifica que el botón se renderiza
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })
})
