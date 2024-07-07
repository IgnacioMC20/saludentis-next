import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'

import { PatientSelect } from '@/components'

jest.mock('@mui/icons-material', () => ({
  ArrowCircleRightOutlined: () => <svg data-testid="ArrowCircleRightOutlined" />,
}))

const theme = createTheme()

describe('PatientSelect', () => {

  it('renders the PatientSelect component', () => {
    render(
      <ThemeProvider theme={theme}>
        <PatientSelect />
      </ThemeProvider>
    )

    const headerElement = screen.getByText('Paciente')
    expect(headerElement).toBeInTheDocument()

    const patientSelect = screen.getByRole('combobox')
    expect(patientSelect).toBeInTheDocument()

    const ingresarButton = screen.getByText('Ingresar')
    expect(ingresarButton).toBeInTheDocument()

    const calendarioLink = screen.getByText('Calendario').closest('a')
    expect(calendarioLink).toHaveAttribute('href', 'https://calendar.google.com/calendar')
  })
})
