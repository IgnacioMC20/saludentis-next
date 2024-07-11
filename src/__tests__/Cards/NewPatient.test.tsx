import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'

import { NewPatient } from '@/components'

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

const theme = createTheme()

describe('NewPatientCard', () => {
  it('renders the NewPatientCard component', () => {
    render(
      <ThemeProvider theme={theme}>
        <NewPatient />
      </ThemeProvider>
    )

    const niñoButton = screen.getByText('Niño')
    expect(niñoButton).toBeInTheDocument()

    const adultoButton = screen.getByText('Adulto')
    expect(adultoButton).toBeInTheDocument()
  })

  it('has links to the correct paths', () => {
    render(
      <ThemeProvider theme={theme}>
        <NewPatient />
      </ThemeProvider>
    )

    const niñoLink = screen.getByText('Niño').closest('a')
    expect(niñoLink).toHaveAttribute('href', '/nuevo/nino')

    const adultoLink = screen.getByText('Adulto').closest('a')
    expect(adultoLink).toHaveAttribute('href', '/nuevo/adulto')
  })
})
