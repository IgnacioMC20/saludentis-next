import { PictureAsPdf } from '@mui/icons-material'
import {
    Box,
    Typography,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Chip,
    CircularProgress,
    Button
} from '@mui/material'
import React from 'react'

import { IQuotation } from '@/models/Quotation'
import { theme } from '@/themes'
import { formatDateToDDMMMYYYY } from '@/utils'

interface QuotationDetailsProps {
    quotation?: IQuotation;
    isLoading?: boolean;
    onExportPDF?: () => void;
}

export const QuotationDetails: React.FC<QuotationDetailsProps> = ({ 
    quotation, 
    isLoading = false,
    onExportPDF 
}) => {
    // Format currency function
    const formatCurrency = (amount?: number) => {
        if (amount === undefined) return 'N/A'
        return `Q. ${amount.toLocaleString('es-GT')}`
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Header Section */}
            <Typography variant="h5" component="h2" gutterBottom>
                Detalles de la Cotización
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Main Information */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Paciente
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {(() => {
                            const patient = quotation?.patientId as any
                            if (!patient) return 'N/A'
                            if (typeof patient === 'string') return patient
                            const fullName = `${patient.firstName || ''} ${patient.middleName || ''} ${patient.lastName || ''}`.trim()
                            return fullName || 'N/A'
                        })()}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Total
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatCurrency(quotation?.total)}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Fecha de Creación
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatDateToDDMMMYYYY(quotation?.createdAt)}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Última Actualización
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatDateToDDMMMYYYY(quotation?.updatedAt)}
                    </Typography>
                </Grid>
            </Grid>

            {/* Quotation Details Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Detalles del Tratamiento
            </Typography>

            {quotation?.quotationDetails && quotation.quotationDetails.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
                    <Table aria-label="quotation details table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Diente</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Tratamiento</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Enfermedad</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }} align="right">Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotation.quotationDetails.map((detail: any, index: number) => {
                                const treatment = detail.treatmentId
                                const disease = detail.diseaseId
                                
                                return (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            {detail.tooth || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {typeof treatment === 'object' && treatment?.description
                                                ? treatment.description
                                                : (typeof treatment === 'string' ? treatment : 'N/A')}
                                        </TableCell>
                                        <TableCell>
                                            {typeof disease === 'object' && disease?.detail
                                                ? disease.detail
                                                : (typeof disease === 'string' ? disease : 'N/A')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {typeof treatment === 'object' && treatment?.price
                                                ? formatCurrency(treatment.price)
                                                : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body1" color="text.secondary" align="center">
                        No hay detalles de cotización disponibles
                    </Typography>
                </Box>
            )}

            {/* Annotations Section */}
            {quotation?.annotations && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Anotaciones
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {quotation.annotations}
                        </Typography>
                    </Paper>
                </Box>
            )}

            {/* Summary Section */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Chip
                    label={`Total: ${formatCurrency(quotation?.total)}`}
                    color="primary"
                    sx={{ fontWeight: 'bold', color: 'white' }}
                />
                <Typography variant="caption" color="text.secondary">
                    {quotation?.quotationDetails?.length || 0} tratamientos registrados
                </Typography>
            </Box>

            {/* Export PDF Button */}
            {onExportPDF && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PictureAsPdf />}
                        onClick={onExportPDF}
                        sx={{ minWidth: '200px' }}
                    >
                        Exportar a PDF
                    </Button>
                </Box>
            )}
        </Box>
    )
}