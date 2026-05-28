import { PictureAsPdf } from '@mui/icons-material'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import React from 'react'

import { IQuotation } from '@/models/Quotation'
import { theme } from '@/themes'
import { formatDateToDDMMMYYYY } from '@/utils/formatDate'

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

    const patient = quotation?.patientId as any
    const patientName = (() => {
        if (!patient) return 'N/A'
        if (typeof patient === 'string') return patient
        const fullName = `${patient.firstName || ''} ${patient.middleName || ''} ${patient.lastName || ''}`.trim()
        return fullName || 'N/A'
    })()

    const treatmentCount = quotation?.quotationDetails?.length || 0

    if (isLoading) {
        return (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
                sx={{
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${theme.celeste2} 0%, #ffffff 58%, ${theme.gray} 100%)`,
                    border: '1px solid rgba(11, 192, 192, 0.18)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{ color: theme.lightSeaGreen, fontWeight: 700, letterSpacing: 1.2 }}
                        >
                            Cotización Dental
                        </Typography>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: '#1f2937' }}>
                            Detalles del plan de tratamiento
                        </Typography>
                    </Box>
                    <Chip
                        label={formatCurrency(quotation?.total)}
                        sx={{
                            alignSelf: 'flex-start',
                            bgcolor: theme.lightSeaGreen,
                            color: theme.white,
                            fontWeight: 800,
                            fontSize: '1rem',
                            px: 1,
                        }}
                    />
                </Box>

                <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 1.75, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.gray}` }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                Paciente
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {patientName}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 1.75, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.gray}` }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                Creación
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {formatDateToDDMMMYYYY(quotation?.createdAt)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 1.75, borderRadius: 3, boxShadow: 'none', border: `1px solid ${theme.gray}` }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                Actualización
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {formatDateToDDMMMYYYY(quotation?.updatedAt)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 2, mb: 1.5 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f2937' }}>
                            Tratamientos incluidos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Revisa el detalle sin perder la posición de la modal.
                        </Typography>
                    </Box>
                    <Chip
                        variant="outlined"
                        label={`${treatmentCount} tratamientos`}
                        sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
                    />
                </Box>

                {quotation?.quotationDetails && quotation.quotationDetails.length > 0 ? (
                    <TableContainer
                        component={Paper}
                        data-testid="quotation-treatments-scroll"
                        sx={{
                            maxHeight: { xs: 320, md: 420 },
                            overflowY: 'auto',
                            boxShadow: 'none',
                            border: `1px solid ${theme.gray}`,
                            borderRadius: 3,
                        }}
                        style={{ overflowY: 'auto' }}
                    >
                        <Table stickyHeader aria-label="quotation details table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 800, width: 92 }}>Diente</TableCell>
                                    <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>Tratamiento</TableCell>
                                    <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>Enfermedad</TableCell>
                                    <TableCell sx={{ backgroundColor: '#f8fafc', fontWeight: 800 }} align="right">Precio</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {quotation.quotationDetails.map((detail: any, index: number) => {
                                    const treatment = detail.treatmentId
                                    const disease = detail.diseaseId

                                    return (
                                        <TableRow
                                            key={index}
                                            hover
                                            sx={{
                                                '&:nth-of-type(even)': {
                                                    bgcolor: 'rgba(196, 255, 249, 0.28)',
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 800, color: theme.lightSeaGreen }}>
                                                {detail.tooth || 'N/A'}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                {typeof treatment === 'object' && treatment?.description
                                                    ? treatment.description
                                                    : (typeof treatment === 'string' ? treatment : 'N/A')}
                                            </TableCell>
                                            <TableCell>
                                                {typeof disease === 'object' && disease?.detail
                                                    ? disease.detail
                                                    : (typeof disease === 'string' ? disease : 'N/A')}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
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
                    <Box sx={{ mt: 2, p: 3, bgcolor: 'background.paper', borderRadius: 3, border: `1px solid ${theme.gray}` }}>
                        <Typography variant="body1" color="text.secondary" align="center">
                            No hay detalles de cotización disponibles
                        </Typography>
                    </Box>
                )}
            </Box>

            {quotation?.annotations && (
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Anotaciones
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f8fafc', boxShadow: 'none', borderRadius: 3, border: `1px solid ${theme.gray}` }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {quotation.annotations}
                        </Typography>
                    </Paper>
                </Box>
            )}

            <Paper
                sx={{
                    position: 'sticky',
                    bottom: -40,
                    zIndex: 1,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(11, 192, 192, 0.2)',
                    bgcolor: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Total de la cotización
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#1f2937' }}>
                        {formatCurrency(quotation?.total)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {treatmentCount} tratamientos registrados
                    </Typography>
                </Box>
                {onExportPDF && (
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PictureAsPdf />}
                        onClick={onExportPDF}
                        sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                    >
                        Exportar a PDF
                    </Button>
                )}
            </Paper>
        </Box>
    )
}
