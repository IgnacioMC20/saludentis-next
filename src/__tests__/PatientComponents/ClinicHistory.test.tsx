import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import ClinicHistory from '@/components/PatientComponents/ClinicHistory'

describe('ClinicHistory Component', () => {

    it('renders the save button correctly', () => {
        render(<ClinicHistory />)
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })

    it('checks a checkbox when clicked', () => {
        render(<ClinicHistory />)
        const checkbox = screen.getByLabelText('Enfermedad del corazon')
        fireEvent.click(checkbox)
        expect(checkbox).toBeChecked()
    })

    it('submits the form when the save button is clicked', () => {
        render(<ClinicHistory />)
        const button = screen.getByRole('button', { name: /guardar/i })
        fireEvent.click(button)
    })
})
