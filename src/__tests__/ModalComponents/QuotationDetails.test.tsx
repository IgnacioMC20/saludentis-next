import { fireEvent, render, screen, within } from '@testing-library/react'

import { QuotationDetails } from '@/components/ModalComponents/QuotationDetails'

const buildQuotation = (itemsCount = 24) => ({
    patientId: {
        firstName: 'Ana',
        middleName: 'Lucia',
        lastName: 'Paz',
    },
    total: 6000,
    createdAt: new Date('2026-05-27T12:00:00.000Z'),
    updatedAt: new Date('2026-05-27T12:00:00.000Z'),
    annotations: 'Plan de tratamiento por fases.',
    quotationDetails: Array.from({ length: itemsCount }, (_, index) => ({
        tooth: String(index + 1),
        treatmentId: {
            description: `Tratamiento dental ${index + 1}`,
            price: 250,
        },
        diseaseId: {
            detail: 'Caries Dental Superficial',
        },
    })),
})

describe('QuotationDetails Component', () => {
    it('renders many treatments inside a scrollable treatment table', () => {
        render(<QuotationDetails quotation={buildQuotation() as any} />)

        const tableRegion = screen.getByTestId('quotation-treatments-scroll')
        expect(tableRegion).toHaveStyle({ overflowY: 'auto' })
        expect(within(tableRegion).getByText('Tratamiento dental 24')).toBeInTheDocument()
        expect(screen.getByText('24 tratamientos registrados')).toBeInTheDocument()
    })

    it('keeps the PDF action available for long quotations', () => {
        const onExportPDF = jest.fn()
        render(<QuotationDetails quotation={buildQuotation() as any} onExportPDF={onExportPDF} />)

        fireEvent.click(screen.getByRole('button', { name: /exportar a pdf/i }))

        expect(onExportPDF).toHaveBeenCalledTimes(1)
    })
})
