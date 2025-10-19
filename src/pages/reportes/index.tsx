import { Card, Typography, Grid, Box, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

import { saludentisApi } from '@/api'
import { IReportsData } from '@/interfaces/reports'
import { Layout } from '@/layout'
import { formatCurrency } from '@/utils/reportMetrics'

export default function Reports() {
    const [reportsData, setReportsData] = useState<IReportsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true)
                // Default to last 30 days
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - 30)

                const response = await saludentisApi({
                    url: `/reports?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&groupBy=month`
                })
                const data = await response.json()

                if (data.ok) {
                    setReportsData(data.data)
                } else {
                    setError(data.message || 'Error loading reports')
                }
            } catch (err: any) {
                setError(err.message || 'Error loading reports')
            } finally {
                setIsLoading(false)
            }
        }

        fetchReports()
    }, [])

    if (isLoading) {
        return (
            <Layout>
                <Card sx={{
                    paddingY: { xs: 3, md: 5 },
                    paddingX: { xs: 2, md: 5 },
                    width: '100%',
                    minHeight: '500px',
                    boxShadow: 'none',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <CircularProgress />
                    </Box>
                </Card>
            </Layout>
        )
    }

    if (error) {
        return (
            <Layout>
                <Card sx={{
                    paddingY: { xs: 3, md: 5 },
                    paddingX: { xs: 2, md: 5 },
                    width: '100%',
                    minHeight: '500px',
                    boxShadow: 'none',
                }}>
                    <Typography variant='h4' mb={3} align='center'>Reportes</Typography>
                    <Typography color="error" align="center">{error}</Typography>
                </Card>
            </Layout>
        )
    }

    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 5 },
                paddingX: { xs: 2, md: 5 },
                width: '100%',
                minHeight: '500px',
                boxShadow: 'none',
            }}>
                <Typography variant='h4' mb={3} align='center'>Reportes - Últimos 30 días</Typography>

                <Grid container spacing={3}>
                    {/* KPI Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Ingresos Totales</Typography>
                            <Typography variant="h4" color="primary">
                                {formatCurrency(reportsData?.kpis.totalRevenue || 0)}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Pagos Cobrados</Typography>
                            <Typography variant="h4" color="success.main">
                                {formatCurrency(reportsData?.kpis.collectedPayments || 0)}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Saldos Pendientes</Typography>
                            <Typography variant="h4" color="warning.main">
                                {formatCurrency(reportsData?.kpis.outstandingBalances || 0)}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Consultas</Typography>
                            <Typography variant="h4" color="info.main">
                                {reportsData?.kpis.consultationsCount || 0}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Pacientes Atendidos</Typography>
                            <Typography variant="h4">
                                {reportsData?.kpis.patientsSeen || 0}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Pacientes Nuevos</Typography>
                            <Typography variant="h4">
                                {reportsData?.kpis.newPatients || 0}
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Cobros Pendientes</Typography>
                            <Typography variant="h4" color="error.main">
                                {formatCurrency(reportsData?.kpis.pendingCollections || 0)}
                            </Typography>
                        </Card>
                    </Grid>

                    {/* A/R Aging Section */}
                    <Grid item xs={12}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5" mb={2}>Antigüedad de Cuentas por Cobrar</Typography>
                            <Grid container spacing={2}>
                                {reportsData?.arAging.map((bucket, index) => (
                                    <Grid item xs={12} sm={6} md={3} key={index}>
                                        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">{bucket.range}</Typography>
                                            <Typography variant="h6" color="primary">
                                                {formatCurrency(bucket.amount)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {bucket.count} paciente{bucket.count !== 1 ? 's' : ''}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
        </Layout>
    )
}