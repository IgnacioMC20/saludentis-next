import { TrendingUp, AccountBalance, People, Receipt } from '@mui/icons-material'
import { Card, Typography, Grid, Box, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, TablePagination } from '@mui/material'
import { format, subMonths, startOfYear } from 'date-fns'
import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

import { IReportsData } from '@/interfaces/reports'
import { Layout } from '@/layout'
import { theme } from '@/themes'
import { formatCurrency, formatDate } from '@/utils/reportMetrics'

type DatePreset = 'thisMonth' | 'last3Months' | 'ytd' | 'custom'

export default function Reports() {
    const [loading, setLoading] = useState(true)
    const [reportsData, setReportsData] = useState<IReportsData | null>(null)
    const [datePreset, setDatePreset] = useState<DatePreset>('thisMonth')
    const [startDate, setStartDate] = useState(format(subMonths(new Date(), 1), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('month')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        fetchReportsData()
    }, [startDate, endDate, groupBy, page, rowsPerPage])

    useEffect(() => {
        updateDatesFromPreset()
    }, [datePreset])

    const updateDatesFromPreset = () => {
        const now = new Date()
        switch (datePreset) {
            case 'thisMonth':
                setStartDate(format(subMonths(now, 1), 'yyyy-MM-dd'))
                setEndDate(format(now, 'yyyy-MM-dd'))
                break
            case 'last3Months':
                setStartDate(format(subMonths(now, 3), 'yyyy-MM-dd'))
                setEndDate(format(now, 'yyyy-MM-dd'))
                break
            case 'ytd':
                setStartDate(format(startOfYear(now), 'yyyy-MM-dd'))
                setEndDate(format(now, 'yyyy-MM-dd'))
                break
            case 'custom':
                break
        }
    }

    const fetchReportsData = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
                groupBy,
                page: (page + 1).toString(),
                pageSize: rowsPerPage.toString()
            })
            const response = await fetch(`/api/reports?${params}`)
            const result = await response.json()
            if (result.success) {
                setReportsData(result.data)
            }
        } catch (error) {
            console.error('Error fetching reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const COLORS = [theme.lightSeaGreen, theme.robinEggBlue, theme.tiffanyBlue, theme.celeste, theme.celeste2]

    return (
        <Layout>
            <Box sx={{ width: '100%', maxWidth: '1400px', height: 'auto', p: 4, marginTop: '16px', marginBottom: '16px', overflowY: 'auto', backgroundColor: 'white' }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant='h4' sx={{ fontWeight: 600 }}>Reportes Financieros</Typography>
                </Box>

                <Card sx={{ mb: 3, p: 5 }}>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField select fullWidth label='Período' value={datePreset} onChange={(e) => setDatePreset(e.target.value as DatePreset)} size='small'>
                                <MenuItem value='thisMonth'>Este Mes</MenuItem>
                                <MenuItem value='last3Months'>Últimos 3 Meses</MenuItem>
                                <MenuItem value='ytd'>Año Actual</MenuItem>
                                <MenuItem value='custom'>Personalizado</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth type='date' label='Fecha Inicio' value={startDate} onChange={(e) => { setStartDate(e.target.value); setDatePreset('custom') }} size='small' InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField fullWidth type='date' label='Fecha Fin' value={endDate} onChange={(e) => { setEndDate(e.target.value); setDatePreset('custom') }} size='small' InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField select fullWidth label='Agrupar Por' value={groupBy} onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')} size='small'>
                                <MenuItem value='day'>Día</MenuItem>
                                <MenuItem value='week'>Semana</MenuItem>
                                <MenuItem value='month'>Mes</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Card>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { icon: <TrendingUp sx={{ color: theme.lightSeaGreen, mr: 1 }} />, label: 'Ingresos Totales', value: formatCurrency(reportsData?.kpis.totalRevenue || 0) },
                        { icon: <AccountBalance sx={{ color: theme.robinEggBlue, mr: 1 }} />, label: 'Pagos Cobrados', value: formatCurrency(reportsData?.kpis.collectedPayments || 0) },
                        { icon: <Receipt sx={{ color: theme.purple, mr: 1 }} />, label: 'Saldos Pendientes', value: formatCurrency(reportsData?.kpis.outstandingBalances || 0), color: theme.purple },
                        { icon: <People sx={{ color: theme.tiffanyBlue, mr: 1 }} />, label: 'Pacientes Atendidos', value: reportsData?.kpis.patientsSeen || 0 }
                    ].map((kpi, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card sx={{ p: 5, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {kpi.icon}
                                    <Typography variant='body2' color='text.secondary'>{kpi.label}</Typography>
                                </Box>
                                {loading ? <Skeleton variant='text' width='80%' height={40} /> : <Typography variant='h5' sx={{ fontWeight: 600, color: kpi.color }}>{kpi.value}</Typography>}
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        { label: 'Consultas', value: reportsData?.kpis.consultationsCount || 0 },
                        { label: 'Nuevos Pacientes', value: reportsData?.kpis.newPatients || 0 },
                        { label: 'Cobros Pendientes', value: formatCurrency(reportsData?.kpis.pendingCollections || 0), color: theme.purple }
                    ].map((kpi, idx) => (
                        <Grid item xs={12} sm={4} key={idx}>
                            <Card sx={{ p: 5, textAlign: 'center' }}>
                                <Typography variant='body2' color='text.secondary' gutterBottom>{kpi.label}</Typography>
                                {loading ? <Skeleton variant='text' width='60%' height={30} sx={{ mx: 'auto' }} /> : <Typography variant='h6' sx={{ fontWeight: 600, color: kpi.color }}>{kpi.value}</Typography>}
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card sx={{ mb: 3, p: 5 }}>
                    <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Tendencia de Ingresos y Cobros</Typography>
                    {loading ? <Skeleton variant='rectangular' height={300} /> : (
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={reportsData?.revenueTrend || []}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='date' />
                                <YAxis />
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                <Legend />
                                <Line type='monotone' dataKey='revenue' stroke={theme.lightSeaGreen} name='Ingresos' strokeWidth={2} />
                                <Line type='monotone' dataKey='collections' stroke={theme.robinEggBlue} name='Cobros' strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </Card>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%' }}>
                            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Antigüedad de Cuentas por Cobrar</Typography>
                            {loading ? <Skeleton variant='rectangular' height={250} /> : (
                                <ResponsiveContainer width='100%' height={250}>
                                    <BarChart data={reportsData?.arAging || []}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='range' />
                                        <YAxis />
                                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                        <Bar dataKey='amount' name='Monto'>
                                            {reportsData?.arAging.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%' }}>
                            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Top 10 Tratamientos</Typography>
                            {loading ? <Skeleton variant='rectangular' height={250} /> : (
                                <TableContainer sx={{ maxHeight: 250 }}>
                                    <Table size='small' stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tratamiento</TableCell>
                                                <TableCell align='right'>Cantidad</TableCell>
                                                <TableCell align='right'>Ingresos</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reportsData?.topTreatments.map((treatment) => (
                                                <TableRow key={treatment.treatmentId}>
                                                    <TableCell>{treatment.treatmentName}</TableCell>
                                                    <TableCell align='right'>{treatment.count}</TableCell>
                                                    <TableCell align='right'>{formatCurrency(treatment.revenue)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%' }}>
                            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Top 10 Pacientes con Saldo</Typography>
                            {loading ? <Skeleton variant='rectangular' height={250} /> : (
                                <TableContainer sx={{ maxHeight: 250 }}>
                                    <Table size='small' stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Paciente</TableCell>
                                                <TableCell align='right'>Saldo</TableCell>
                                                <TableCell align='right'>Pendiente</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reportsData?.topPatients.map((patient) => (
                                                <TableRow key={patient.patientId}>
                                                    <TableCell>{patient.patientName}</TableCell>
                                                    <TableCell align='right'>{formatCurrency(patient.balance)}</TableCell>
                                                    <TableCell align='right'>{formatCurrency(patient.pending)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 5, height: '100%' }}>
                            <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Embudo de Cotizaciones</Typography>
                            {loading ? <Skeleton variant='rectangular' height={250} /> : (
                                <Box>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.gray, borderRadius: 2 }}>
                                                <Typography variant='body2' color='text.secondary'>Total Cotizado</Typography>
                                                <Typography variant='h6' sx={{ fontWeight: 600 }}>{formatCurrency(reportsData?.quotationFunnel.totalQuoted || 0)}</Typography>
                                                <Typography variant='caption' color='text.secondary'>{reportsData?.quotationFunnel.quotationsCount || 0} cotizaciones</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.gray, borderRadius: 2 }}>
                                                <Typography variant='body2' color='text.secondary'>Convertido</Typography>
                                                <Typography variant='h6' sx={{ fontWeight: 600, color: theme.lightSeaGreen }}>{formatCurrency(reportsData?.quotationFunnel.convertedAmount || 0)}</Typography>
                                                <Typography variant='caption' color='text.secondary'>{reportsData?.quotationFunnel.convertedCount || 0} consultas</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.celeste2, borderRadius: 2 }}>
                                        <Typography variant='body2' color='text.secondary'>Tasa de Conversión</Typography>
                                        <Typography variant='h4' sx={{ fontWeight: 600, color: theme.lightSeaGreen }}>{reportsData?.quotationFunnel.conversionRate.toFixed(1) || 0}%</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>

                <Card sx={{ mb: 3, p: 5 }}>
                    <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Saldos de Pacientes</Typography>
                    {loading ? <Skeleton variant='rectangular' height={400} /> : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell>DPI/CUI</TableCell>
                                            <TableCell>Última Visita</TableCell>
                                            <TableCell align='right'>Saldo</TableCell>
                                            <TableCell align='right'>Pendiente</TableCell>
                                            <TableCell>Contacto</TableCell>
                                            <TableCell>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reportsData?.patientBalances.data.map((patient) => (
                                            <TableRow key={patient.patientId}>
                                                <TableCell>{patient.patientName}</TableCell>
                                                <TableCell>{patient.nationalId}</TableCell>
                                                <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                                                <TableCell align='right'>{formatCurrency(patient.balance)}</TableCell>
                                                <TableCell align='right'>{formatCurrency(patient.pending)}</TableCell>
                                                <TableCell>{patient.phone || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip label={patient.status} size='small' color={patient.status === 'Due' ? 'error' : 'success'} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component='div'
                                count={reportsData?.patientBalances.total || 0}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                            />
                        </>
                    )}
                </Card>

                <Card sx={{ mb: 3, p: 5 }}>
                    <Typography variant='h6' gutterBottom sx={{ fontWeight: 600 }}>Consultas Recientes</Typography>
                    {loading ? <Skeleton variant='rectangular' height={400} /> : (
                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Paciente</TableCell>
                                        <TableCell align='right'>Total</TableCell>
                                        <TableCell align='right'>Pagado</TableCell>
                                        <TableCell align='right'>Pendiente</TableCell>
                                        <TableCell align='center'>Tratamientos</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportsData?.consultations.map((consultation) => (
                                        <TableRow key={consultation.consultationId}>
                                            <TableCell>{formatDate(consultation.date)}</TableCell>
                                            <TableCell>{consultation.patientName}</TableCell>
                                            <TableCell align='right'>{formatCurrency(consultation.total)}</TableCell>
                                            <TableCell align='right'>{formatCurrency(consultation.paid)}</TableCell>
                                            <TableCell align='right' sx={{ color: consultation.due > 0 ? theme.purple : 'inherit' }}>{formatCurrency(consultation.due)}</TableCell>
                                            <TableCell align='center'>{consultation.treatmentsCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </Box>
        </Layout>
    )
}