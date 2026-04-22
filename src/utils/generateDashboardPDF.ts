import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { IReportsData } from '@/interfaces/reports'
import { formatCurrency } from '@/utils/reportMetrics'

interface DashboardPDFInput {
    data: IReportsData;
    dateRangeLabel: string;
    siteLabel: string;
    doctorLabel: string;
    statusLabel: string;
}

export const generateDashboardPDF = ({
    data,
    dateRangeLabel,
    siteLabel,
    doctorLabel,
    statusLabel,
}: DashboardPDFInput) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let currentY = 18

    const colors = {
        teal: [0, 131, 134] as [number, number, number],
        aqua: [102, 224, 230] as [number, number, number],
        purple: [126, 92, 194] as [number, number, number],
        text: [28, 37, 44] as [number, number, number],
        muted: [108, 122, 137] as [number, number, number],
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(...colors.teal)
    doc.text('Saludentis Dashboard', 16, currentY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...colors.muted)
    currentY += 7
    doc.text(`Generado el ${format(new Date(), 'PPpp', { locale: es })}`, 16, currentY)

    currentY += 8
    doc.setDrawColor(...colors.aqua)
    doc.line(16, currentY, pageWidth - 16, currentY)

    currentY += 8
    doc.setTextColor(...colors.text)
    doc.text(`Periodo: ${dateRangeLabel}`, 16, currentY)
    currentY += 5
    doc.text(`Sede: ${siteLabel}`, 16, currentY)
    currentY += 5
    doc.text(`Doctor: ${doctorLabel}`, 16, currentY)
    currentY += 5
    doc.text(`Estado: ${statusLabel}`, 16, currentY)

    currentY += 8
    autoTable(doc, {
        startY: currentY,
        head: [['Indicador', 'Valor']],
        body: [
            ['Ingresos totales', formatCurrency(data.kpis.totalRevenue)],
            ['Pagos cobrados', formatCurrency(data.kpis.collectedPayments)],
            ['Saldos pendientes', formatCurrency(data.kpis.outstandingBalances)],
            ['Pacientes atendidos', String(data.kpis.patientsSeen)],
            ['Consultas', String(data.kpis.consultationsCount)],
            ['Nuevos pacientes', String(data.kpis.newPatients)],
            ['Cobros pendientes', String(data.kpis.pendingCollectionsCount)],
        ],
        headStyles: {
            fillColor: colors.teal,
            textColor: [255, 255, 255],
        },
        styles: {
            fontSize: 10,
            textColor: colors.text,
        },
        columnStyles: {
            1: { halign: 'right' },
        },
    })

    currentY = (doc as any).lastAutoTable.finalY + 8
    autoTable(doc, {
        startY: currentY,
        head: [['Alertas', 'Cantidad']],
        body: [
            ['Alertas totales', String(data.alerts.total)],
            ['Cobros pendientes', String(data.alerts.pendingCollections)],
            ['Saldos >90 días', String(data.alerts.overdueOver90Days)],
        ],
        headStyles: {
            fillColor: colors.purple,
            textColor: [255, 255, 255],
        },
        styles: {
            fontSize: 10,
            textColor: colors.text,
        },
        columnStyles: {
            1: { halign: 'right' },
        },
    })

    currentY = (doc as any).lastAutoTable.finalY + 8
    autoTable(doc, {
        startY: currentY,
        head: [['Top tratamiento', 'Cantidad', 'Ingresos']],
        body: data.topTreatments.slice(0, 5).map(treatment => [
            treatment.treatmentName,
            String(treatment.count),
            formatCurrency(treatment.revenue),
        ]),
        headStyles: {
            fillColor: colors.aqua,
            textColor: colors.text,
        },
        styles: {
            fontSize: 9,
            textColor: colors.text,
        },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' },
        },
    })

    currentY = (doc as any).lastAutoTable.finalY + 8
    autoTable(doc, {
        startY: currentY,
        head: [['Paciente', 'Pendiente', 'Estado']],
        body: data.topPatients.slice(0, 5).map(patient => [
            patient.patientName,
            formatCurrency(patient.pending),
            patient.status,
        ]),
        headStyles: {
            fillColor: colors.teal,
            textColor: [255, 255, 255],
        },
        styles: {
            fontSize: 9,
            textColor: colors.text,
        },
        columnStyles: {
            1: { halign: 'right' },
        },
    })

    const fileName = `Dashboard_Saludentis_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`
    doc.save(fileName)
}
