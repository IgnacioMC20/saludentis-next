import {
    calculateAppointmentStatusMetrics,
    createMetricComparison,
    getPatientBalanceStatus,
    normalizeConsultationStatus,
} from '@/utils/reportMetrics'

describe('reportMetrics helpers', () => {
    it('creates metric comparisons against previous period', () => {
        expect(createMetricComparison(120, 100, 'vs periodo anterior')).toMatchObject({
            current: 120,
            previous: 100,
            deltaPercent: 20,
            trend: 'up',
            comparisonLabel: 'vs periodo anterior',
        })
    })

    it('normalizes invalid consultation statuses to completada', () => {
        expect(normalizeConsultationStatus('invalid')).toBe('completada')
        expect(normalizeConsultationStatus(undefined)).toBe('completada')
        expect(normalizeConsultationStatus('cancelada')).toBe('cancelada')
    })

    it('derives patient balance severity from age and pending amount', () => {
        expect(getPatientBalanceStatus(0, 0)).toBe('Al día')
        expect(getPatientBalanceStatus(12, 200)).toBe('Pendiente')
        expect(getPatientBalanceStatus(45, 200)).toBe('Vencido')
        expect(getPatientBalanceStatus(100, 200)).toBe('Crítico')
    })

    it('calculates appointment status distribution', () => {
        const distribution = calculateAppointmentStatusMetrics([
            { status: 'confirmada' } as any,
            { status: 'completada' } as any,
            { status: 'completada' } as any,
            { status: 'no_asistio' } as any,
        ])

        expect(distribution.find(item => item.status === 'completada')).toMatchObject({
            count: 2,
            percentage: 50,
        })
        expect(distribution.find(item => item.status === 'confirmada')).toMatchObject({
            count: 1,
            percentage: 25,
        })
    })
})
