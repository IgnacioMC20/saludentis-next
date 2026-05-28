import autoTable from 'jspdf-autotable'

import { generateQuotationPDF } from '@/utils/generateQuotationPDF'

const saveMock = jest.fn()
const addPageMock = jest.fn()
const textMock = jest.fn()

const mockDoc = {
    internal: {
        pageSize: {
            getWidth: jest.fn(() => 210),
            getHeight: jest.fn(() => 297),
        },
    },
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    setTextColor: jest.fn(),
    text: textMock,
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    line: jest.fn(),
    getTextWidth: jest.fn((text: string) => text.length * 2),
    splitTextToSize: jest.fn(() => Array.from({ length: 12 }, (_, index) => `annotation line ${index + 1}`)),
    addPage: addPageMock,
    save: saveMock,
    lastAutoTable: {
        finalY: 286,
    },
}

jest.mock('jspdf', () => ({
    __esModule: true,
    default: jest.fn(() => mockDoc),
}))

jest.mock('jspdf-autotable', () => ({
    __esModule: true,
    default: jest.fn((doc) => {
        doc.lastAutoTable = { finalY: 286 }
    }),
}))

const treatments = Array.from({ length: 35 }, (_, index) => ({
    tooth: String(index + 1),
    treatment: `Tratamiento ${index + 1}`,
    disease: 'Caries Dental Superficial',
    price: 250,
}))

describe('generateQuotationPDF', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockDoc.lastAutoTable = { finalY: 286 }
    })

    it('exports long quotation tables through autoTable and saves the PDF', () => {
        generateQuotationPDF({
            quotation: {
                total: 8750,
                createdAt: new Date('2026-05-27T12:00:00.000Z'),
                annotations: 'Paciente requiere seguimiento posterior a la fase inicial.',
            },
            patient: {
                firstName: 'Ana',
                middleName: 'Lucia',
                lastName: 'Paz',
                nationalId: '1234567890101',
            },
            treatments,
        } as any)

        expect(autoTable).toHaveBeenCalledWith(
            mockDoc,
            expect.objectContaining({
                body: expect.arrayContaining([
                    ['35', '35', 'Tratamiento 35', 'Caries Dental Superficial', 'Q. 250.00'],
                ]),
            })
        )
        expect(saveMock).toHaveBeenCalledWith(expect.stringMatching(/^Cotizacion_Ana_Lucia_Paz_/))
    })

    it('adds a new page before rendering summary content when a long table ends near the page bottom', () => {
        generateQuotationPDF({
            quotation: {
                total: 8750,
                createdAt: new Date('2026-05-27T12:00:00.000Z'),
                annotations: 'Paciente requiere seguimiento posterior a la fase inicial.',
            },
            patient: {
                firstName: 'Ana',
                middleName: 'Lucia',
                lastName: 'Paz',
                nationalId: '1234567890101',
            },
            treatments,
        } as any)

        expect(addPageMock).toHaveBeenCalled()
    })
})
