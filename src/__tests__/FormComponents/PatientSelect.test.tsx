import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select } from '@/components'

describe('PatientSelect', () => {
    const patients = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
    ]

    it('renders the patient select component', () => {
        render(<Select patients={patients} />)
        const patientSelect = screen.getByRole('combobox')
        expect(patientSelect).toBeInTheDocument()
    })

    it('displays the correct number of options when opened', async () => {
        render(<Select patients={patients} />)
        const patientSelect = screen.getByRole('combobox')

        userEvent.click(patientSelect)

        const options = await screen.findAllByRole('option')
        expect(options).toHaveLength(patients.length)
    })

    it('displays the correct patient names as options', async () => {
        render(<Select patients={patients} />)
        const patientSelect = screen.getByRole('combobox')

        userEvent.click(patientSelect)

        const options = await screen.findAllByRole('option')
        options.forEach((option, index) => {
            expect(option).toHaveTextContent(patients[index].name)
        })
    })
})
