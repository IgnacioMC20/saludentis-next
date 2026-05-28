import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { IQuotation } from '@/models/Quotation'

interface PatientInfo {
    firstName: string
    middleName?: string
    lastName: string
    nationalId: string
}

interface TreatmentDetail {
    tooth: string
    treatment: string
    disease: string
    price: number
}

interface QuotationPDFData {
    quotation: IQuotation
    patient: PatientInfo
    treatments: TreatmentDetail[]
}

export const generateQuotationPDF = (data: QuotationPDFData): void => {
    const { quotation, patient, treatments } = data

    // Create PDF document
    const doc = new jsPDF()

    // Configuration
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const footerY = pageHeight - 20
    const contentBottomY = footerY - 12
    let yPosition = 20

    // Colors
    const primaryColor: [number, number, number] = [41, 128, 185] // Blue
    const secondaryColor: [number, number, number] = [52, 73, 94] // Dark gray

    const ensureSpace = (requiredHeight: number) => {
        if (yPosition + requiredHeight > contentBottomY) {
            doc.addPage()
            yPosition = margin
        }
    }

    // 1. Header - Company Name
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('SALUDENTIS', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    // 2. Document Title
    doc.setFontSize(16)
    doc.setTextColor(...secondaryColor)
    doc.text('Cotización de Tratamiento Dental', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // 3. Divider line
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // 4. Patient Information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...secondaryColor)
    doc.text('Información del Paciente', margin, yPosition)
    yPosition += 7

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    
    const patientName = `${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`.trim()
    doc.text(`Paciente: ${patientName}`, margin, yPosition)
    yPosition += 6
    
    doc.text(`DPI: ${patient.nationalId}`, margin, yPosition)
    yPosition += 6
    
    const quotationDate = quotation.createdAt 
        ? format(new Date(quotation.createdAt), 'PPP', { locale: es })
        : format(new Date(), 'PPP', { locale: es })
    doc.text(`Fecha: ${quotationDate}`, margin, yPosition)
    yPosition += 12

    // 5. Treatments Table
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Detalle de Tratamientos', margin, yPosition)
    yPosition += 5

    // Prepare table data
    const tableData = treatments.map((t, index) => [
        (index + 1).toString(),
        t.tooth || 'N/A',
        t.treatment,
        t.disease,
        `Q. ${t.price.toFixed(2)}`
    ])

    // Generate table
    autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Diente', 'Tratamiento', 'Diagnóstico', 'Precio']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'center'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5,
            overflow: 'linebreak'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { halign: 'center', cellWidth: 20 },
            2: { halign: 'left', cellWidth: 50 },
            3: { halign: 'left', cellWidth: 50 },
            4: { halign: 'right', cellWidth: 30 }
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    })

    // Get final Y position after table. autoTable paginates long treatment lists.
    yPosition = ((doc as any).lastAutoTable?.finalY || yPosition) + 10

    // 6. Total
    ensureSpace(18)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    
    const total = quotation.total || 0
    const totalText = `TOTAL: Q. ${total.toFixed(2)}`
    const totalWidth = doc.getTextWidth(totalText)
    doc.text(totalText, pageWidth - margin - totalWidth, yPosition)
    yPosition += 12

    // 7. Annotations (if any)
    if (quotation.annotations && quotation.annotations.trim()) {
        ensureSpace(16)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...secondaryColor)
        doc.text('Anotaciones:', margin, yPosition)
        yPosition += 7

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        
        // Split annotations into lines to fit page width
        const maxWidth = pageWidth - (2 * margin)
        const annotationLines = doc.splitTextToSize(quotation.annotations, maxWidth)
        
        annotationLines.forEach((line: string) => {
            ensureSpace(5)
            doc.text(line, margin, yPosition)
            yPosition += 5
        })

        yPosition += 10
    }

    // 8. Footer
    doc.setDrawColor(...primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(128, 128, 128)
    
    const generatedText = `Generado el ${format(new Date(), 'PPpp', { locale: es })}`
    doc.text(generatedText, pageWidth / 2, footerY, { align: 'center' })

    // 9. Save/Download PDF
    const fileName = `Cotizacion_${patientName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`
    doc.save(fileName)
}
