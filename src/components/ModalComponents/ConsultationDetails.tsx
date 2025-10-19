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
    CircularProgress
} from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import React from 'react'

import { IConsultation, IConsultationDetail } from '@/models/Consultation'
import { theme } from '@/themes'

interface ConsultationDetailsProps {
    consultation?: IConsultation;
    isLoading?: boolean;
}

export const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({ consultation, isLoading = false }) => {
    // Format date function
    const formatDate = (date?: Date) => {
        if (!date) return 'N/A'
        return format(new Date(date), 'PPP', { locale: es })
    }

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

    console.log('=== ConsultationDetails Component ===')
    console.log('Full consultation object:', consultation)
    console.log('Consultation details array:', consultation?.consultationDetails)
    console.log('Number of details:', consultation?.consultationDetails?.length)
    
    // Log each detail individually
    consultation?.consultationDetails?.forEach((detail: IConsultationDetail, index: number) => {
        console.log(`Detail ${index}:`, {
            tooth: detail.tooth,
            treatmentId: detail.treatmentId,
            diseaseId: detail.diseaseId,
            createdAt: detail.createdAt,
            fullDetail: detail
        })
    })

    return (
        <Box sx={{ p: 2 }}>
            {/* Header Section */}
            <Typography variant="h5" component="h2" gutterBottom>
                Detalles de la Consulta
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Main Information */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Paciente
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {consultation?.patientId?.toString() || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Total
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatCurrency(consultation?.total)}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Fecha de Creación
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatDate(consultation?.createdAt)}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Última Actualización
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {formatDate(consultation?.updatedAt)}
                    </Typography>
                </Grid>
            </Grid>

            {/* Consultation Details Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Detalles del Tratamiento
            </Typography>

            {consultation?.consultationDetails && consultation.consultationDetails.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
                    <Table aria-label="consultation details table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Diente</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Tratamiento ID</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Enfermedad ID</TableCell>
                                <TableCell sx={{ backgroundColor: theme.gray, fontWeight: 700 }}>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {consultation.consultationDetails.map((detail: IConsultationDetail, index: number) => (
                                <TableRow key={index} hover>
                                    <TableCell>
                                        {detail.tooth || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {detail.treatmentId?.toString() || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {detail.diseaseId?.toString() || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(detail.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body1" color="text.secondary" align="center">
                        No hay detalles de consulta disponibles
                    </Typography>
                </Box>
            )}

            {/* Summary Section */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip
                    label={`Total: ${formatCurrency(consultation?.total)}`}
                    color="primary"
                    sx={{ fontWeight: 'bold', color: 'white' }}
                />
                <Typography variant="caption" color="text.secondary">
                    {consultation?.consultationDetails?.length || 0} tratamientos registrados
                </Typography>
            </Box>
        </Box>
    )
}
