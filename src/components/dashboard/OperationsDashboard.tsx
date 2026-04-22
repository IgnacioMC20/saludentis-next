import {
    AddCircleOutlineRounded,
    CalendarMonthRounded,
    FilterListRounded,
    Groups2Outlined,
    KeyboardArrowDownRounded,
    NotificationsNoneRounded,
    PersonAddAlt1Rounded,
    SearchRounded,
    WarningAmberRounded,
} from '@mui/icons-material'
import {
    alpha,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { differenceInCalendarDays, endOfMonth, format, startOfMonth, subMonths } from 'date-fns'
import { useRouter } from 'next/router'
import { Dispatch, useContext, useMemo, useState } from 'react'

import { Select as PatientSelectField } from '@/components/FormComponents'
import { NewConsultationForm } from '@/components/ModalComponents'
import { Modal } from '@/components/ui'
import { AuthContext } from '@/context'
import { usePatients, useReports } from '@/hooks'
import { CONSULTATION_STATUS_LABELS, ConsultationStatus } from '@/interfaces/reports'
import { theme } from '@/themes'
import { formatCurrency, formatDate } from '@/utils'

type FilterState = {
    startDate: string
    endDate: string
    siteName: string
    doctorName: string
    consultationStatus: ConsultationStatus | 'todos'
}

type PatientActionMode = 'patient' | 'consultation' | null

const getDefaultFilters = (): FilterState => {
    const now = new Date()
    const start = format(startOfMonth(subMonths(now, 0)), 'yyyy-MM-dd')
    const end = format(endOfMonth(now), 'yyyy-MM-dd')

    return {
        startDate: start,
        endDate: end,
        siteName: 'todos',
        doctorName: 'todos',
        consultationStatus: 'todos',
    }
}

const getGroupBy = (startDate: string, endDate: string): 'day' | 'week' | 'month' => {
    const diff = Math.abs(differenceInCalendarDays(new Date(endDate), new Date(startDate)))
    if (diff > 120) return 'month'
    if (diff > 35) return 'week'
    return 'day'
}

const getInitials = (name?: string, lastName?: string) => {
    return `${name?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'SA'
}

const DashboardDonut = ({
    value,
    total,
    color,
    secondaryColor,
    label,
}: {
    value: number
    total: number
    color: string
    secondaryColor: string
    label: string
}) => {
    const percentage = total > 0 ? (value / total) * 100 : 0

    return (
        <Box
            sx={{
                width: 168,
                height: 168,
                borderRadius: '50%',
                background: `conic-gradient(${color} 0 ${percentage}%, ${secondaryColor} ${percentage}% 100%)`,
                display: 'grid',
                placeItems: 'center',
                position: 'relative',
                mx: 'auto',
            }}
        >
            <Box
                sx={{
                    width: 106,
                    height: 106,
                    borderRadius: '50%',
                    backgroundColor: theme.white,
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(217, 232, 234, 0.65)',
                    px: 1,
                }}
            >
                <Box>
                    <Typography variant="h5">{total.toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

const SlimMetricCard = ({
    title,
    value,
    deltaPercent,
}: {
    title: string
    value: string
    deltaPercent: number
}) => (
    <Card sx={{ px: 3, py: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
            <Stack direction="row" spacing={1.25} alignItems="center">
                <Typography variant="h6">{value}</Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: deltaPercent >= 0 ? theme.success : theme.red,
                        fontWeight: 700,
                    }}
                >
                    {deltaPercent >= 0 ? '+' : ''}
                    {deltaPercent.toFixed(1)}%
                </Typography>
            </Stack>
        </Stack>
    </Card>
)

const TableSearchField = ({
    label,
    value,
    onChange,
}: {
    label: string
    value: string
    onChange: Dispatch<string>
}) => (
    <TextField
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                </InputAdornment>
            ),
        }}
        sx={{ width: { xs: '100%', sm: 240 } }}
    />
)

const PatientActionDialog = ({
    open,
    mode,
    onClose,
}: {
    open: boolean
    mode: PatientActionMode
    onClose: () => void
}) => {
    const router = useRouter()
    const { data: patientsResponse, isLoading } = usePatients()
    const [patientId, setPatientId] = useState<string | null>(null)
    const [consultationOpen, setConsultationOpen] = useState(false)

    const patients = patientsResponse?.data || []

    return (
        <>
            <Modal open={open} handleClose={onClose}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="h5">
                            {mode === 'patient' ? 'Ingresar a paciente' : 'Nueva cita'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                            Selecciona un paciente para continuar.
                        </Typography>
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <PatientSelectField patients={patients} setPatientId={setPatientId as any} />
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
                        <Button variant="outlined" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            disabled={!patientId}
                            onClick={() => {
                                if (!patientId) return

                                if (mode === 'patient') {
                                    router.push(`/paciente/${patientId}`)
                                    onClose()
                                } else {
                                    setConsultationOpen(true)
                                    onClose()
                                }
                            }}
                        >
                            Continuar
                        </Button>
                    </Stack>
                </Stack>
            </Modal>

            <Modal
                open={consultationOpen}
                handleClose={() => {
                    setConsultationOpen(false)
                    setPatientId(null)
                }}
            >
                {patientId ? (
                    <NewConsultationForm
                        patientId={patientId}
                        onSuccess={() => {
                            setConsultationOpen(false)
                            router.push(`/paciente/saldo/${patientId}`)
                        }}
                    />
                ) : null}
            </Modal>
        </>
    )
}

export const OperationsDashboard = () => {
    const router = useRouter()
    const { user } = useContext(AuthContext)
    const [draftFilters, setDraftFilters] = useState<FilterState>(getDefaultFilters)
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(getDefaultFilters)
    const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null)
    const [actionDialogMode, setActionDialogMode] = useState<PatientActionMode>(null)
    const [consultationSearch, setConsultationSearch] = useState('')
    const [consultationPage, setConsultationPage] = useState(0)
    const [consultationsRowsPerPage, setConsultationsRowsPerPage] = useState(5)

    const groupBy = getGroupBy(appliedFilters.startDate, appliedFilters.endDate)
    const reportQuery = useReports({
        startDate: new Date(appliedFilters.startDate),
        endDate: new Date(appliedFilters.endDate),
        siteName: appliedFilters.siteName === 'todos' ? undefined : appliedFilters.siteName,
        doctorName: appliedFilters.doctorName === 'todos' ? undefined : appliedFilters.doctorName,
        consultationStatus: appliedFilters.consultationStatus,
        groupBy,
        page: 1,
        pageSize: 1000,
    })
    const reportsData = reportQuery.data?.data

    const filteredConsultations = useMemo(() => {
        const rows = reportsData?.consultations || []
        const query = consultationSearch.trim().toLowerCase()
        if (!query) return rows

        return rows.filter(consultation => {
            return `${consultation.patientName} ${consultation.doctorName} ${consultation.siteName}`.toLowerCase().includes(query)
        })
    }, [consultationSearch, reportsData?.consultations])

    const paginatedConsultations = useMemo(() => {
        const start = consultationPage * consultationsRowsPerPage
        return filteredConsultations.slice(start, start + consultationsRowsPerPage)
    }, [consultationPage, consultationsRowsPerPage, filteredConsultations])

    const quickActions = [
        {
            title: 'Nuevo paciente niño',
            icon: <PersonAddAlt1Rounded />,
            onClick: () => router.push('/paciente/nuevo'),
        },
        {
            title: 'Nuevo paciente adulto',
            icon: <Groups2Outlined />,
            onClick: () => router.push('/paciente/nuevo?tipo=adulto'),
        },
        {
            title: 'Ingresar a paciente',
            icon: <SearchRounded />,
            onClick: () => setActionDialogMode('patient'),
        },
        {
            title: 'Nueva cita',
            icon: <AddCircleOutlineRounded />,
            onClick: () => setActionDialogMode('consultation'),
        },
        {
            title: 'Calendario',
            icon: <CalendarMonthRounded />,
            onClick: () => window.open('https://calendar.google.com/calendar', '_blank', 'noopener,noreferrer'),
        },
    ]

    if (reportQuery.isLoading && !reportsData) {
        return (
            <Stack spacing={2.5} sx={{ py: { xs: 2, md: 3 } }}>
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: '26px' }} />
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: '26px' }} />
                <Skeleton variant="rounded" height={360} sx={{ borderRadius: '26px' }} />
            </Stack>
        )
    }

    if (reportQuery.isError || !reportsData) {
        return (
            <Card sx={{ p: 4, mt: 3 }}>
                <Typography variant="h5">No se pudo cargar el dashboard</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Revisa la conexión con la base de datos o intenta recargar la página.
                </Typography>
                <Button sx={{ mt: 3, width: 'fit-content' }} onClick={() => reportQuery.refetch()}>
                    Reintentar
                </Button>
            </Card>
        )
    }

    return (
        <>
            <Stack spacing={3} sx={{ py: { xs: 2, md: 3 } }}>
                <Card
                    sx={{
                        p: { xs: 2, md: 3 },
                        position: 'sticky',
                        top: { xs: 76, md: 18 },
                        zIndex: 20,
                        backdropFilter: 'blur(16px)',
                    }}
                >
                    <Stack spacing={2.5}>
                        <Stack
                            direction={{ xs: 'column', lg: 'row' }}
                            spacing={2}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', lg: 'center' }}
                        >
                            <Box sx={{ maxWidth: 680 }}>
                                <Typography variant="h3">Panel principal</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                                    Resumen operativo con accesos rápidos, actividad reciente y señales del día.
                                </Typography>
                            </Box>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                <Chip
                                    icon={<WarningAmberRounded sx={{ color: theme.red }} />}
                                    label={`${reportsData.alerts.total} alertas`}
                                    sx={{ backgroundColor: alpha(theme.red, 0.08), color: theme.red, justifyContent: 'flex-start' }}
                                />
                                <Chip
                                    icon={<WarningAmberRounded sx={{ color: theme.red }} />}
                                    label={`${reportsData.alerts.overdueOver90Days} saldos >90 días`}
                                    sx={{ backgroundColor: alpha(theme.red, 0.08), color: theme.red, justifyContent: 'flex-start' }}
                                />
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <IconButton sx={{ border: `1px solid ${alpha(theme.border, 0.9)}` }}>
                                    <Badge badgeContent={reportsData.alerts.total} color="error">
                                        <NotificationsNoneRounded />
                                    </Badge>
                                </IconButton>
                                <Stack direction="row" spacing={1.25} alignItems="center">
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(theme.lightSeaGreen, 0.18),
                                            color: theme.lightSeaGreen,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {getInitials(user?.name, user?.lastName)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {user ? `${user.name} ${user.lastName}` : 'Equipo Saludentis'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Administrador
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Divider />

                        <Stack spacing={2}>
                            <Grid container spacing={1.5}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Periodo"
                                        value={draftFilters.startDate}
                                        onChange={(event) => setDraftFilters(current => ({ ...current, startDate: event.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                        helperText={`Hasta ${format(new Date(draftFilters.endDate), 'dd/MM/yyyy')}`}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Fecha fin"
                                        value={draftFilters.endDate}
                                        onChange={(event) => setDraftFilters(current => ({ ...current, endDate: event.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Sede"
                                        value={draftFilters.siteName}
                                        onChange={(event) => setDraftFilters(current => ({ ...current, siteName: event.target.value }))}
                                    >
                                        <MenuItem value="todos">Todas las sedes</MenuItem>
                                        {reportsData.availableFilters.sites.map(site => (
                                            <MenuItem key={site} value={site}>
                                                {site}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Doctor"
                                        value={draftFilters.doctorName}
                                        onChange={(event) => setDraftFilters(current => ({ ...current, doctorName: event.target.value }))}
                                    >
                                        <MenuItem value="todos">Todos los doctores</MenuItem>
                                        {reportsData.availableFilters.doctors.map(doctor => (
                                            <MenuItem key={doctor} value={doctor}>
                                                {doctor}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Estado"
                                        value={draftFilters.consultationStatus}
                                        onChange={(event) => setDraftFilters(current => ({ ...current, consultationStatus: event.target.value as ConsultationStatus | 'todos' }))}
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

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.5}
                                justifyContent="space-between"
                                alignItems={{ xs: 'stretch', sm: 'center' }}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterListRounded />}
                                    onClick={() => {
                                        setDraftFilters(getDefaultFilters())
                                        setAppliedFilters(getDefaultFilters())
                                    }}
                                >
                                    Resetear filtros
                                </Button>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                                    <Button variant="outlined" onClick={() => setAppliedFilters(draftFilters)}>
                                        Aplicar filtros
                                    </Button>
                                    <Button onClick={(event) => setActionsAnchor(event.currentTarget)} endIcon={<KeyboardArrowDownRounded />}>
                                        Nueva acción
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} lg={8}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6">Acciones rápidas</Typography>
                            <Box
                                sx={{
                                    mt: 1.5,
                                    display: 'grid',
                                    gap: 1.5,
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, minmax(0, 1fr))',
                                        md: 'repeat(3, minmax(0, 1fr))',
                                        xl: 'repeat(5, minmax(0, 1fr))',
                                    },
                                }}
                            >
                                {quickActions.map(action => (
                                    <Button
                                        key={action.title}
                                        variant="outlined"
                                        onClick={action.onClick}
                                        sx={{
                                            width: '100%',
                                            minHeight: 90,
                                            justifyContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            flexDirection: 'column',
                                            gap: 1.25,
                                            px: 2,
                                            py: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '14px',
                                                display: 'grid',
                                                placeItems: 'center',
                                                backgroundColor: alpha(theme.robinEggBlue, 0.16),
                                                color: theme.lightSeaGreen,
                                            }}
                                        >
                                            {action.icon}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: theme.black, textAlign: 'left' }}>
                                            {action.title}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Pacientes niños vs adultos</Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ mt: 1.5 }}>
                                <DashboardDonut
                                    value={reportsData.ageMix.children}
                                    total={reportsData.ageMix.total}
                                    color={theme.lightSeaGreen}
                                    secondaryColor={alpha(theme.robinEggBlue, 0.5)}
                                    label="pacientes"
                                />
                                <Stack spacing={1.25} sx={{ width: '100%' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: theme.lightSeaGreen }} />
                                            <Typography variant="body2">Niños</Typography>
                                        </Stack>
                                        <Typography variant="body2" fontWeight={700}>
                                            {reportsData.ageMix.children.toLocaleString()} ({reportsData.ageMix.childrenPercentage}%)
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: alpha(theme.robinEggBlue, 0.85) }} />
                                            <Typography variant="body2">Adultos</Typography>
                                        </Stack>
                                        <Typography variant="body2" fontWeight={700}>
                                            {reportsData.ageMix.adults.toLocaleString()} ({reportsData.ageMix.adultsPercentage}%)
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="text.secondary">Total</Typography>
                                        <Typography variant="h6">{reportsData.ageMix.total.toLocaleString()}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} md={4}>
                        <SlimMetricCard
                            title="Pacientes atendidos"
                            value={reportsData.kpis.patientsSeen.toLocaleString()}
                            deltaPercent={reportsData.comparisons.patientsSeen.deltaPercent}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SlimMetricCard
                            title="Consultas"
                            value={reportsData.kpis.consultationsCount.toLocaleString()}
                            deltaPercent={reportsData.comparisons.consultationsCount.deltaPercent}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SlimMetricCard
                            title="Nuevos pacientes"
                            value={reportsData.kpis.newPatients.toLocaleString()}
                            deltaPercent={reportsData.comparisons.newPatients.deltaPercent}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} lg={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Distribución de citas por estado</Typography>
                            <Stack spacing={1.1} sx={{ mt: 2 }}>
                                {reportsData.appointmentStatus.map(metric => (
                                    <Stack key={metric.status} spacing={0.75}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2">{metric.label}</Typography>
                                            <Typography variant="body2" fontWeight={700}>
                                                {metric.count} ({metric.percentage}%)
                                            </Typography>
                                        </Stack>
                                        <Box sx={{ width: '100%', height: 10, borderRadius: 999, backgroundColor: alpha(theme.border, 0.45), overflow: 'hidden' }}>
                                            <Box
                                                sx={{
                                                    width: `${Math.max(metric.percentage, 6)}%`,
                                                    height: '100%',
                                                    borderRadius: 999,
                                                    backgroundColor: metric.status === 'cancelada'
                                                        ? theme.red
                                                        : metric.status === 'no_asistio'
                                                            ? theme.amber
                                                            : metric.status === 'confirmada'
                                                                ? theme.robinEggBlue
                                                                : theme.lightSeaGreen,
                                                }}
                                            />
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <Card sx={{ p: 0 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ p: 3, pb: 2 }}>
                                <Box>
                                    <Typography variant="h6">Consultas recientes</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {filteredConsultations.length} registros filtrados
                                    </Typography>
                                </Box>
                                <TableSearchField
                                    label="Buscar consulta"
                                    value={consultationSearch}
                                    onChange={(value) => {
                                        setConsultationSearch(value)
                                        setConsultationPage(0)
                                    }}
                                />
                            </Stack>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell>Ubicación</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                            <TableCell>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedConsultations.map(consultation => (
                                            <TableRow key={consultation.consultationId} hover>
                                                <TableCell>{formatDate(consultation.date)}</TableCell>
                                                <TableCell>{consultation.patientName}</TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.25}>
                                                        <Typography variant="body2">{consultation.siteName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {consultation.doctorName}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(consultation.total)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={CONSULTATION_STATUS_LABELS[consultation.status]}
                                                        sx={{
                                                            color: consultation.status === 'cancelada'
                                                                ? theme.red
                                                                : consultation.status === 'no_asistio'
                                                                    ? theme.amber
                                                                    : consultation.status === 'confirmada'
                                                                        ? theme.lightSeaGreen
                                                                        : theme.success,
                                                            backgroundColor: consultation.status === 'cancelada'
                                                                ? alpha(theme.red, 0.12)
                                                                : consultation.status === 'no_asistio'
                                                                    ? alpha(theme.amber, 0.16)
                                                                    : consultation.status === 'confirmada'
                                                                        ? alpha(theme.lightSeaGreen, 0.12)
                                                                        : alpha(theme.success, 0.12),
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredConsultations.length}
                                page={consultationPage}
                                onPageChange={(_event, nextPage) => setConsultationPage(nextPage)}
                                rowsPerPage={consultationsRowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setConsultationsRowsPerPage(Number(event.target.value))
                                    setConsultationPage(0)
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Stack>

            <Menu
                anchorEl={actionsAnchor}
                open={Boolean(actionsAnchor)}
                onClose={() => setActionsAnchor(null)}
                PaperProps={{ sx: { mt: 1.5, borderRadius: '18px', minWidth: 220 } }}
            >
                {quickActions.map(action => (
                    <MenuItem
                        key={action.title}
                        onClick={() => {
                            setActionsAnchor(null)
                            action.onClick()
                        }}
                    >
                        {action.title}
                    </MenuItem>
                ))}
            </Menu>

            <PatientActionDialog
                open={actionDialogMode !== null}
                mode={actionDialogMode}
                onClose={() => setActionDialogMode(null)}
            />
        </>
    )
}
