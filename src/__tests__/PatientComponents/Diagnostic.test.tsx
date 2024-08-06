import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import Diagnostic from '@/components/PatientComponents/Diagnostic'

describe('Diagnostic Component', () => {
    it('renders the diagnostic and medication fields correctly', () => {
        render(<Diagnostic />)
        expect(screen.getByText(/diagnóstico/i)).toBeInTheDocument()
        expect(screen.getByText(/medicamentos recetados/i)).toBeInTheDocument()
    })

    it('renders the save button correctly', () => {
        render(<Diagnostic />)
        expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
    })

    it('handles the save button click', () => {
        render(<Diagnostic />)
        const button = screen.getByRole('button', { name: /guardar/i })
        fireEvent.click(button)
    })
})
