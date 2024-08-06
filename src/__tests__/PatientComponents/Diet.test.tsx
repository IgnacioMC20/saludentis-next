import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import Diet from '@/components/PatientComponents/Diet'

describe('Diet Component', () => {
    it('renders all checkboxes correctly', () => {
        render(<Diet />)
        const checkboxLabels = ['Riñon y vegija', 'Hígado y vesicula', 'Pulmón e intestino grueso', 'Brazo, estómago y páncreas', 'Corazón, intestino delgado y sistema nervioso']
        checkboxLabels.forEach(label => {
            expect(screen.getByLabelText(label)).toBeInTheDocument()
        })
    })

    it('renders the image correctly', () => {
        render(<Diet />)
        expect(screen.getByAltText('odontologia_neurofocal')).toBeInTheDocument()
    })

    it('renders the save button correctly', () => {
        render(<Diet />)
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })

    it('checks a checkbox when clicked', () => {
        render(<Diet />)
        const checkbox = screen.getByLabelText('Riñon y vegija')
        fireEvent.click(checkbox)
        expect(checkbox).toBeChecked()
    })

    it('handles the save button click', () => {
        render(<Diet />)
        const button = screen.getByRole('button', { name: /guardar/i })
        fireEvent.click(button)
    })
})
