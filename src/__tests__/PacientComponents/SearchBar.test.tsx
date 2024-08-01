import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import SearchAppBar from '@/components/PacientComponents/SearchBar' // Asegúrate de que la ruta sea correcta
import '@testing-library/jest-dom'

describe('SearchAppBar component', () => {
  it('should render the SearchAppBar component with the correct elements', () => {
    render(<SearchAppBar />)

    // Verifica que el icono de AccountCircle se renderiza
    expect(screen.getByLabelText('open drawer')).toBeInTheDocument()

    // Verifica que el nombre del usuario se renderiza
    expect(screen.getByText('Jose Perez')).toBeInTheDocument()

    // Verifica que los botones de las páginas se renderizan
    const pages = ['Datos Personales', 'Ficha Clinica', 'Planes de Tratamiento','Facturacion y pagos']

    pages.forEach((page) => {
      expect(screen.getByText(page)).toBeInTheDocument()
    })

    // Verifica que el campo de búsqueda se renderiza
    expect(screen.getByPlaceholderText('Buscar…')).toBeInTheDocument()
  })

  it('should call showId function when a button is clicked', () => {
    const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

    render(<SearchAppBar />)

    // Simula un click en el botón "Datos Personales"
    fireEvent.click(screen.getByText('Datos Personales'))

    // Verifica que showId fue llamado con el id correcto
    expect(consoleLogMock).toHaveBeenCalledWith('Datos Personales')

    consoleLogMock.mockRestore()
  })
})
