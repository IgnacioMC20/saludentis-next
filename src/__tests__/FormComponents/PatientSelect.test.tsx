import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select } from '@/components'

describe('PatientSelect', () => {
    const patients = [
        { _id: '1', firstName: 'John', lastName: 'Doe', nationalId: '1234567890101' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', nationalId: '1234567890102' },
        { _id: '3', firstName: 'Bob', lastName: 'Johnson', nationalId: '1234567890103' },
    ]
    const mockSetPatientId = jest.fn()

    it('renders the patient select component', () => {
        render(<Select patients={patients} setPatientId={mockSetPatientId} />)
        const patientSelect = screen.getByRole('combobox')
        expect(patientSelect).toBeInTheDocument()
    })

    it('displays the correct number of options when opened', async () => {
        render(<Select patients={patients} setPatientId={mockSetPatientId} />)
        const patientSelect = screen.getByRole('combobox')

        userEvent.click(patientSelect)

        const options = await screen.findAllByRole('option')
        expect(options).toHaveLength(patients.length)
    })

    it('displays the correct patient names as options', async () => {
        render(<Select patients={patients} setPatientId={mockSetPatientId} />)
        const patientSelect = screen.getByRole('combobox')

        userEvent.click(patientSelect)

        const options = await screen.findAllByRole('option')
        options.forEach((option, index) => {
            const fullName = `${patients[index].firstName} ${patients[index].lastName}`
            expect(option).toHaveTextContent(fullName)
        })
    })
})
