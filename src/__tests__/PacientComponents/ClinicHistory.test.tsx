import { render, screen } from '@testing-library/react'
import React from 'react'

import ClinicHistory from '@/components/PacientComponents/ClinicHistory' // Asegúrate de que la ruta sea correcta
import '@testing-library/jest-dom'

describe('ClinicHistory component', () => {
  it('should render the ClinicHistory component', () => {
    render(<ClinicHistory/>)

    // Verifica que los títulos de sección existan
    // const elements = screen.getAllByText('Antecedentes Medicos')
    // expect(elements).toHaveLength(2)

    // const elements2 = screen.getAllByText('Antecedentes Odontologicos')
    // expect(elements2).toHaveLength(2)

    // Verifica que al menos un checkbox se renderiza
    expect(screen.getByLabelText('Enfermedad del corazon')).toBeInTheDocument()

    // Verifica que los campos de texto se renderizan
    expect(screen.getAllByRole('textbox')).toHaveLength(3)

    // Verifica que el botón se renderiza
    expect(screen.getByRole('button', { name: 'Actualizar Datos' })).toBeInTheDocument()
  })
})
