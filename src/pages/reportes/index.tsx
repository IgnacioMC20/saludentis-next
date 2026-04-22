import {
    DownloadRounded,
    PaymentsOutlined,
    TrendingUpRounded,
    WarningAmberRounded,
} from '@mui/icons-material'
import {
    alpha,
    Box,
    Button,
    Card,
    Grid,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import { useReports } from '@/hooks'
import { CONSULTATION_STATUS_LABELS, ConsultationStatus } from '@/interfaces/reports'
import { Layout } from '@/layout'
import { theme } from '@/themes'
import { generateDashboardPDF, formatCurrency, formatDate } from '@/utils'

type FilterState = {
    startDate: string
    endDate: string
    siteName: string
    doctorName: string
    consultationStatus: ConsultationStatus | 'todos'
}

const getDefaultFilters = (): FilterState => {
    const now = new Date()

    return {
        startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(now), 'yyyy-MM-dd'),
        siteName: 'todos',
        doctorName: 'todos',
        consultationStatus: 'todos',
    }
}

const patientStatusStyles = (status: string) => {
    switch (status) {
        case 'Crítico':
            return { color: theme.red, backgroundColor: alpha(theme.red, 0.12) }
        case 'Vencido':
            return { color: theme.amber, backgroundColor: alpha(theme.amber, 0.16) }
        case 'Pendiente':
            return { color: theme.lightSeaGreen, backgroundColor: alpha(theme.lightSeaGreen, 0.12) }
        default:
            return { color: theme.success, backgroundColor: alpha(theme.success, 0.12) }
    }
}

export default function Reports() {
    const [filters, setFilters] = useState<FilterState>(getDefaultFilters)

    const reportQuery = useReports({
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
        siteName: filters.siteName === 'todos' ? undefined : filters.siteName,
        doctorName: filters.doctorName === 'todos' ? undefined : filters.doctorName,
        consultationStatus: filters.consultationStatus,
        groupBy: 'month',
        page: 1,
        pageSize: 50,
    })

    const reportsData = reportQuery.data?.data

    return (
        <Layout>
            <Stack spacing={3} sx={{ py: { xs: 2, md: 3 } }}>
                <Card sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: 'column', lg: 'row' }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', lg: 'center' }}
                    >
                        <Box>
                            <Typography variant="h3">Reportes financieros</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                                Vista detallada para revisar ingresos, cobros, saldos y rendimiento por tratamiento.
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<DownloadRounded />}
                            disabled={!reportsData}
                            onClick={() => {
                                if (!reportsData) return

                                generateDashboardPDF({
                                    data: reportsData,
                                    dateRangeLabel: `${format(new Date(filters.startDate), 'dd/MM/yyyy')} - ${format(new Date(filters.endDate), 'dd/MM/yyyy')}`,
                                    siteLabel: filters.siteName === 'todos' ? 'Todas las sedes' : filters.siteName,
                                    doctorLabel: filters.doctorName === 'todos' ? 'Todos los doctores' : filters.doctorName,
                                    statusLabel: filters.consultationStatus === 'todos'
                                        ? 'Todos'
                                        : CONSULTATION_STATUS_LABELS[filters.consultationStatus],
                                })
                            }}
                        >
                            Exportar resumen
                        </Button>
                    </Stack>

                    <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Inicio"
                                value={filters.startDate}
                                onChange={(event) => setFilters(current => ({ ...current, startDate: event.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Fin"
                                value={filters.endDate}
                                onChange={(event) => setFilters(current => ({ ...current, endDate: event.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                select
                                fullWidth
                                label="Sede"
                                value={filters.siteName}
                                onChange={(event) => setFilters(current => ({ ...current, siteName: event.target.value }))}
                            >
                                <MenuItem value="todos">Todas las sedes</MenuItem>
                                {reportsData?.availableFilters.sites.map(site => (
                                    <MenuItem key={site} value={site}>
                                        {site}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                select
                                fullWidth
                                label="Doctor"
                                value={filters.doctorName}
                                onChange={(event) => setFilters(current => ({ ...current, doctorName: event.target.value }))}
                            >
                                <MenuItem value="todos">Todos los doctores</MenuItem>
                                {reportsData?.availableFilters.doctors.map(doctor => (
                                    <MenuItem key={doctor} value={doctor}>
                                        {doctor}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <TextField
                                select
                                fullWidth
                                label="Estado"
                                value={filters.consultationStatus}
                                onChange={(event) => setFilters(current => ({ ...current, consultationStatus: event.target.value as ConsultationStatus | 'todos' }))}
                            >
                                <MenuItem value="todos">Todos</MenuItem>
                                {Object.entries(CONSULTATION_STATUS_LABELS).map(([status, label]) => (
                                    <MenuItem key={status} value={status}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Card>

                {!reportsData ? (
                    <Card sx={{ p: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Cargando reportes...
                        </Typography>
                    </Card>
                ) : (
                    <>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <TrendingUpRounded sx={{ color: theme.lightSeaGreen }} />
                                        <Typography variant="body2" color="text.secondary">Ingresos totales</Typography>
                                    </Stack>
                                    <Typography variant="h4" sx={{ mt: 1.25 }}>
                                        {formatCurrency(reportsData.kpis.totalRevenue)}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <PaymentsOutlined sx={{ color: theme.robinEggBlue }} />
                                        <Typography variant="body2" color="text.secondary">Pagos cobrados</Typography>
                                    </Stack>
                                    <Typography variant="h4" sx={{ mt: 1.25 }}>
                                        {formatCurrency(reportsData.kpis.collectedPayments)}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ p: 3 }}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <WarningAmberRounded sx={{ color: theme.red }} />
                                        <Typography variant="body2" color="text.secondary">Saldos pendientes</Typography>
                                    </Stack>
                                    <Typography variant="h4" sx={{ mt: 1.25 }}>
                                        {formatCurrency(reportsData.kpis.outstandingBalances)}
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2.5}>
                            <Grid item xs={12} xl={7}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h6">Ingresos vs cobros</Typography>
                                    <Box sx={{ width: '100%', height: 320, mt: 2 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={reportsData.revenueTrend}>
                                                <defs>
                                                    <linearGradient id="reportsRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={theme.lightSeaGreen} stopOpacity={0.28} />
                                                        <stop offset="95%" stopColor={theme.lightSeaGreen} stopOpacity={0.03} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="4 4" stroke={alpha(theme.border, 0.9)} />
                                                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                                <YAxis tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                                <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                                                <Area dataKey="revenue" stroke={theme.lightSeaGreen} fill="url(#reportsRevenue)" strokeWidth={3} name="Ingresos" />
                                                <Area dataKey="collections" stroke={theme.robinEggBlue} fillOpacity={0} strokeWidth={3} name="Cobros" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12} xl={5}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h6">Antigüedad de cuentas por cobrar</Typography>
                                    <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                                        {reportsData.arAging.map((bucket, index) => {
                                            const maxAmount = Math.max(...reportsData.arAging.map(item => item.amount), 1)
                                            const width = `${Math.max((bucket.amount / maxAmount) * 100, 6)}%`
                                            const colors = [theme.lightSeaGreen, theme.robinEggBlue, theme.amber, theme.red]
                                            return (
                                                <Box key={bucket.range}>
                                                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                                                        <Typography variant="body2">{bucket.range}</Typography>
                                                        <Typography variant="body2" fontWeight={700}>{formatCurrency(bucket.amount)}</Typography>
                                                    </Stack>
                                                    <Box sx={{ mt: 0.75, height: 12, borderRadius: 999, backgroundColor: alpha(theme.border, 0.5) }}>
                                                        <Box sx={{ width, height: '100%', borderRadius: 999, backgroundColor: colors[index] }} />
                                                    </Box>
                                                </Box>
                                            )
                                        })}
                                    </Stack>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2.5}>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h6">Top tratamientos</Typography>
                                    <Box sx={{ width: '100%', height: 320, mt: 2 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={reportsData.topTreatments}>
                                                <CartesianGrid strokeDasharray="4 4" stroke={alpha(theme.border, 0.9)} vertical={false} />
                                                <XAxis dataKey="treatmentName" tick={{ fontSize: 10 }} stroke={theme.textMuted} interval={0} angle={-20} textAnchor="end" height={70} />
                                                <YAxis tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                                <Tooltip formatter={(value: number) => value} />
                                                <Bar dataKey="count" fill={theme.lightSeaGreen} radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ p: 3 }}>
                                    <Typography variant="h6">Top pacientes con saldo</Typography>
                                    <Stack spacing={1.2} sx={{ mt: 2 }}>
                                        {reportsData.topPatients.map(patient => (
                                            <Stack
                                                key={patient.patientId}
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: '16px',
                                                    backgroundColor: alpha(theme.celeste2, 0.9),
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {patient.patientName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatCurrency(patient.pending)}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        px: 1.2,
                                                        py: 0.6,
                                                        borderRadius: 999,
                                                        ...patientStatusStyles(patient.status),
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'inherit' }}>
                                                        {patient.status}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2.5}>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ p: 0 }}>
                                    <Box sx={{ p: 3, pb: 2 }}>
                                        <Typography variant="h6">Saldos de pacientes</Typography>
                                    </Box>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Paciente</TableCell>
                                                    <TableCell>Estado</TableCell>
                                                    <TableCell align="right">Pendiente</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {reportsData.patientBalances.data.slice(0, 10).map(patient => (
                                                    <TableRow key={patient.patientId}>
                                                        <TableCell>{patient.patientName}</TableCell>
                                                        <TableCell>
                                                            <Box
                                                                sx={{
                                                                    px: 1.2,
                                                                    py: 0.6,
                                                                    borderRadius: 999,
                                                                    display: 'inline-flex',
                                                                    ...patientStatusStyles(patient.status),
                                                                }}
                                                            >
                                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'inherit' }}>
                                                                    {patient.status}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="right">{formatCurrency(patient.pending)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Card sx={{ p: 0 }}>
                                    <Box sx={{ p: 3, pb: 2 }}>
                                        <Typography variant="h6">Consultas recientes</Typography>
                                    </Box>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Fecha</TableCell>
                                                    <TableCell>Paciente</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {reportsData.consultations.slice(0, 10).map(consultation => (
                                                    <TableRow key={consultation.consultationId}>
                                                        <TableCell>{formatDate(consultation.date)}</TableCell>
                                                        <TableCell>{consultation.patientName}</TableCell>
                                                        <TableCell align="right">{formatCurrency(consultation.total)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Stack>
        </Layout>
    )
}
