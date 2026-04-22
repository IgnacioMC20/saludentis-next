import {
    AddCircleOutlineRounded,
    CalendarMonthRounded,
    DownloadRounded,
    FilterListRounded,
    Groups2Outlined,
    KeyboardArrowDownRounded,
    MonetizationOnOutlined,
    NorthEastRounded,
    NotificationsNoneRounded,
    PaymentsOutlined,
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

import { Select as PatientSelectField } from '@/components/FormComponents'
import { NewConsultationForm } from '@/components/ModalComponents'
import { Modal } from '@/components/ui'
import { AuthContext } from '@/context'
import { usePatients, useReports, useUpdateConsultation } from '@/hooks'
import { ConsultationStatus, CONSULTATION_STATUS_LABELS } from '@/interfaces/reports'
import { theme } from '@/themes'
import { generateDashboardPDF, formatCurrency, formatDate } from '@/utils'

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

const getDeltaColor = (trend: 'up' | 'down' | 'neutral', invert = false) => {
    if (trend === 'neutral') return theme.textMuted
    if (invert) return trend === 'up' ? theme.red : theme.success
    return trend === 'up' ? theme.success : theme.red
}

const getStatusChipStyles = (status: string) => {
    switch (status) {
        case 'Crítico':
            return {
                color: theme.red,
                backgroundColor: alpha(theme.red, 0.12),
            }
        case 'Vencido':
            return {
                color: theme.amber,
                backgroundColor: alpha(theme.amber, 0.15),
            }
        case 'Pendiente':
            return {
                color: theme.lightSeaGreen,
                backgroundColor: alpha(theme.lightSeaGreen, 0.1),
            }
        case 'Al día':
        default:
            return {
                color: theme.success,
                backgroundColor: alpha(theme.success, 0.12),
            }
    }
}

const getConsultationStatusTone = (status: ConsultationStatus) => {
    switch (status) {
        case 'cancelada':
            return { color: theme.red, backgroundColor: alpha(theme.red, 0.12) }
        case 'no_asistio':
            return { color: theme.amber, backgroundColor: alpha(theme.amber, 0.16) }
        case 'confirmada':
            return { color: theme.lightSeaGreen, backgroundColor: alpha(theme.lightSeaGreen, 0.12) }
        case 'completada':
        default:
            return { color: theme.success, backgroundColor: alpha(theme.success, 0.12) }
    }
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

const MetricCard = ({
    title,
    value,
    comparisonValue,
    comparisonLabel,
    icon,
    accent,
    invertTrend = false,
}: {
    title: string
    value: string
    comparisonValue: number
    comparisonLabel: string
    icon: React.ReactNode
    accent: string
    invertTrend?: boolean
}) => {
    const trend = comparisonValue === 0 ? 'neutral' : comparisonValue > 0 ? 'up' : 'down'

    return (
        <Card sx={{ p: 3, height: '100%', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 36px rgba(14, 40, 46, 0.08)' } }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '18px',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: alpha(accent, 0.12),
                        color: accent,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5 }}>
                        {value}
                    </Typography>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1 }}>
                        <NorthEastRounded
                            sx={{
                                fontSize: '0.9rem',
                                transform: trend === 'down' ? 'rotate(180deg)' : 'none',
                                color: getDeltaColor(trend, invertTrend),
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{ color: getDeltaColor(trend, invertTrend), fontWeight: 700 }}
                        >
                            {Math.abs(comparisonValue).toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {comparisonLabel}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Card>
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

const ConsultationStatusControl = ({
    consultationId,
    status,
}: {
    consultationId: string
    status: ConsultationStatus
}) => {
    const updateConsultation = useUpdateConsultation(consultationId)
    const [currentStatus, setCurrentStatus] = useState<ConsultationStatus>(status)

    return (
        <TextField
            select
            size="small"
            value={currentStatus}
            onChange={(event) => {
                const nextStatus = event.target.value as ConsultationStatus
                setCurrentStatus(nextStatus)
                updateConsultation.mutate({ status: nextStatus } as any)
            }}
            SelectProps={{
                IconComponent: KeyboardArrowDownRounded,
            }}
            sx={{ minWidth: 156 }}
        >
            {Object.entries(CONSULTATION_STATUS_LABELS).map(([option, label]) => (
                <MenuItem key={option} value={option}>
                    {label}
                </MenuItem>
            ))}
        </TextField>
    )
}

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

export const HomeDashboard = () => {
    const router = useRouter()
    const { user } = useContext(AuthContext)
    const [draftFilters, setDraftFilters] = useState<FilterState>(getDefaultFilters)
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(getDefaultFilters)
    const [actionsAnchor, setActionsAnchor] = useState<HTMLElement | null>(null)
    const [actionDialogMode, setActionDialogMode] = useState<PatientActionMode>(null)
    const [balanceSearch, setBalanceSearch] = useState('')
    const [consultationSearch, setConsultationSearch] = useState('')
    const [balancePage, setBalancePage] = useState(0)
    const [consultationPage, setConsultationPage] = useState(0)
    const [balancesRowsPerPage, setBalancesRowsPerPage] = useState(5)
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

    const filteredBalances = useMemo(() => {
        const rows = reportsData?.patientBalances.data || []
        const query = balanceSearch.trim().toLowerCase()
        if (!query) return rows

        return rows.filter(patient => {
            return `${patient.patientName} ${patient.nationalId} ${patient.contact}`.toLowerCase().includes(query)
        })
    }, [balanceSearch, reportsData?.patientBalances.data])

    const filteredConsultations = useMemo(() => {
        const rows = reportsData?.consultations || []
        const query = consultationSearch.trim().toLowerCase()
        if (!query) return rows

        return rows.filter(consultation => {
            return `${consultation.patientName} ${consultation.doctorName} ${consultation.siteName}`.toLowerCase().includes(query)
        })
    }, [consultationSearch, reportsData?.consultations])

    const paginatedBalances = useMemo(() => {
        const start = balancePage * balancesRowsPerPage
        return filteredBalances.slice(start, start + balancesRowsPerPage)
    }, [balancePage, balancesRowsPerPage, filteredBalances])

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

    const selectedSiteLabel = appliedFilters.siteName === 'todos' ? 'Todas las sedes' : appliedFilters.siteName
    const selectedDoctorLabel = appliedFilters.doctorName === 'todos' ? 'Todos los doctores' : appliedFilters.doctorName
    const selectedStatusLabel = appliedFilters.consultationStatus === 'todos'
        ? 'Todos'
        : CONSULTATION_STATUS_LABELS[appliedFilters.consultationStatus]

    const dateRangeLabel = `${format(new Date(appliedFilters.startDate), 'dd MMM yyyy')} - ${format(new Date(appliedFilters.endDate), 'dd MMM yyyy')}`

    if (reportQuery.isLoading && !reportsData) {
        return (
            <Stack spacing={2.5} sx={{ py: { xs: 2, md: 3 } }}>
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: '26px' }} />
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: '26px' }} />
                <Skeleton variant="rounded" height={420} sx={{ borderRadius: '26px' }} />
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
                                <Typography variant="h3">Finanzas</Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                                    Vista financiera consolidada con KPIs, cartera, conversión y detalle de cobros.
                                </Typography>
                            </Box>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                <Chip
                                    icon={<WarningAmberRounded sx={{ color: theme.red }} />}
                                    label={`${reportsData.alerts.total} alertas`}
                                    sx={{
                                        backgroundColor: alpha(theme.red, 0.08),
                                        color: theme.red,
                                        justifyContent: 'flex-start',
                                    }}
                                />
                                <Chip
                                    icon={<PaymentsOutlined sx={{ color: theme.amber }} />}
                                    label={`${reportsData.alerts.pendingCollections} cobros pendientes`}
                                    sx={{
                                        backgroundColor: alpha(theme.amber, 0.12),
                                        color: theme.amber,
                                        justifyContent: 'flex-start',
                                    }}
                                />
                                <Chip
                                    icon={<WarningAmberRounded sx={{ color: theme.red }} />}
                                    label={`${reportsData.alerts.overdueOver90Days} saldos >90 días`}
                                    sx={{
                                        backgroundColor: alpha(theme.red, 0.08),
                                        color: theme.red,
                                        justifyContent: 'flex-start',
                                    }}
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
                                    <Button
                                        variant="outlined"
                                        startIcon={<DownloadRounded />}
                                        onClick={() => {
                                            generateDashboardPDF({
                                                data: reportsData,
                                                dateRangeLabel,
                                                siteLabel: selectedSiteLabel,
                                                doctorLabel: selectedDoctorLabel,
                                                statusLabel: selectedStatusLabel,
                                            })
                                        }}
                                    >
                                        Exportar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setAppliedFilters(draftFilters)}
                                    >
                                        Aplicar filtros
                                    </Button>
                                    <Button
                                        onClick={(event) => setActionsAnchor(event.currentTarget)}
                                        endIcon={<KeyboardArrowDownRounded />}
                                    >
                                        Nueva acción
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} md={6} xl={3}>
                        <MetricCard
                            title="Ingresos totales"
                            value={formatCurrency(reportsData.kpis.totalRevenue)}
                            comparisonValue={reportsData.comparisons.totalRevenue.deltaPercent}
                            comparisonLabel={reportsData.comparisons.totalRevenue.comparisonLabel}
                            icon={<MonetizationOnOutlined />}
                            accent={theme.lightSeaGreen}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <MetricCard
                            title="Pagos cobrados"
                            value={formatCurrency(reportsData.kpis.collectedPayments)}
                            comparisonValue={reportsData.comparisons.collectedPayments.deltaPercent}
                            comparisonLabel={reportsData.comparisons.collectedPayments.comparisonLabel}
                            icon={<PaymentsOutlined />}
                            accent={theme.robinEggBlue}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <MetricCard
                            title="Saldos pendientes"
                            value={formatCurrency(reportsData.kpis.outstandingBalances)}
                            comparisonValue={reportsData.comparisons.outstandingBalances.deltaPercent}
                            comparisonLabel={reportsData.comparisons.outstandingBalances.comparisonLabel}
                            icon={<WarningAmberRounded />}
                            accent={theme.red}
                            invertTrend
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <MetricCard
                            title="Pacientes atendidos"
                            value={reportsData.kpis.patientsSeen.toLocaleString()}
                            comparisonValue={reportsData.comparisons.patientsSeen.deltaPercent}
                            comparisonLabel={reportsData.comparisons.patientsSeen.comparisonLabel}
                            icon={<Groups2Outlined />}
                            accent={theme.robinEggBlue}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2.5}>
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
                    <Grid item xs={12} md={4}>
                        <SlimMetricCard
                            title="Cobros pendientes"
                            value={reportsData.kpis.pendingCollectionsCount.toLocaleString()}
                            deltaPercent={reportsData.comparisons.pendingCollectionsCount.deltaPercent}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2.5} id="finanzas">
                    <Grid item xs={12} xl={5}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Ingresos vs cobros</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {dateRangeLabel}
                            </Typography>
                            <Box sx={{ width: '100%', height: 310, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={reportsData.revenueTrend}>
                                        <defs>
                                            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.lightSeaGreen} stopOpacity={0.28} />
                                                <stop offset="95%" stopColor={theme.lightSeaGreen} stopOpacity={0.02} />
                                            </linearGradient>
                                            <linearGradient id="collectionsFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={theme.robinEggBlue} stopOpacity={0.25} />
                                                <stop offset="95%" stopColor={theme.robinEggBlue} stopOpacity={0.02} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" stroke={alpha(theme.border, 0.9)} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                        <YAxis tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                        <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                                        <Area type="monotone" dataKey="revenue" stroke={theme.lightSeaGreen} fill="url(#revenueFill)" strokeWidth={3} name="Ingresos" />
                                        <Area type="monotone" dataKey="collections" stroke={theme.robinEggBlue} fill="url(#collectionsFill)" strokeWidth={3} name="Cobros" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} xl={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Embudo de cotizaciones</Typography>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={12} md={5}>
                                    <Stack spacing={1.5}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Total cotizado</Typography>
                                            <Typography variant="h5">{formatCurrency(reportsData.quotationFunnel.totalQuoted)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Monto convertido</Typography>
                                            <Typography variant="h5">{formatCurrency(reportsData.quotationFunnel.convertedAmount)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Tasa de conversión</Typography>
                                            <Typography variant="h4" sx={{ color: theme.purple }}>
                                                {reportsData.quotationFunnel.conversionRate.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {reportsData.quotationFunnel.quotationsCount} cotizaciones · {reportsData.quotationFunnel.convertedCount} convertidas
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Stack spacing={1.5} sx={{ mt: { xs: 2, md: 1 } }}>
                                        {[
                                            {
                                                label: 'Total cotizado',
                                                value: reportsData.quotationFunnel.totalQuoted,
                                                width: '100%',
                                                bg: theme.lightSeaGreen,
                                            },
                                            {
                                                label: 'Convertido',
                                                value: reportsData.quotationFunnel.convertedAmount,
                                                width: '76%',
                                                bg: theme.robinEggBlue,
                                            },
                                            {
                                                label: 'Conversión',
                                                value: reportsData.quotationFunnel.convertedAmount,
                                                width: '62%',
                                                bg: theme.purple,
                                            },
                                        ].map(segment => (
                                            <Box
                                                key={segment.label}
                                                sx={{
                                                    width: segment.width,
                                                    mx: 'auto',
                                                    px: 2,
                                                    py: 2.2,
                                                    clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)',
                                                    backgroundColor: alpha(segment.bg, 0.94),
                                                    color: theme.white,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography variant="body2">{segment.label}</Typography>
                                                <Typography variant="h6">{formatCurrency(segment.value)}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} xl={3}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Antigüedad de cuentas por cobrar</Typography>
                            <Stack spacing={2} sx={{ mt: 2.5 }}>
                                {reportsData.arAging.map((bucket, index) => {
                                    const maxAmount = Math.max(...reportsData.arAging.map(item => item.amount), 1)
                                    const ratio = bucket.amount / maxAmount
                                    const barColor = [theme.lightSeaGreen, theme.robinEggBlue, theme.amber, theme.red][index]

                                    return (
                                        <Stack key={bucket.range} spacing={0.75}>
                                            <Stack direction="row" justifyContent="space-between" spacing={1}>
                                                <Typography variant="body2">{bucket.range}</Typography>
                                                <Typography variant="body2" fontWeight={700}>
                                                    {formatCurrency(bucket.amount)}
                                                </Typography>
                                            </Stack>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: 12,
                                                    borderRadius: 999,
                                                    backgroundColor: alpha(theme.border, 0.45),
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: `${Math.max(ratio * 100, 8)}%`,
                                                        height: '100%',
                                                        borderRadius: 999,
                                                        backgroundColor: barColor,
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {bucket.count} pacientes
                                            </Typography>
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} xl={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Top 10 tratamientos</Typography>
                            <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={reportsData.topTreatments}>
                                        <CartesianGrid strokeDasharray="4 4" stroke={alpha(theme.border, 0.9)} vertical={false} />
                                        <XAxis dataKey="treatmentName" tick={{ fontSize: 10 }} stroke={theme.textMuted} interval={0} angle={-25} textAnchor="end" height={78} />
                                        <YAxis tick={{ fontSize: 11 }} stroke={theme.textMuted} />
                                        <Tooltip formatter={(value: number, name: string) => name === 'revenue' ? formatCurrency(Number(value)) : value} />
                                        <Bar dataKey="count" fill={theme.lightSeaGreen} radius={[8, 8, 0, 0]} name="Cantidad" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} xl={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Top 10 pacientes con saldo</Typography>
                            <Stack spacing={1.25} sx={{ mt: 2 }}>
                                {reportsData.topPatients.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        No hay saldos pendientes para este periodo.
                                    </Typography>
                                ) : reportsData.topPatients.slice(0, 5).map((patient, index) => (
                                    <Stack
                                        key={patient.patientId}
                                        direction="row"
                                        spacing={1.5}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: '16px',
                                            backgroundColor: alpha(theme.celeste2, 0.85),
                                        }}
                                    >
                                        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    backgroundColor: alpha(theme.lightSeaGreen, 0.12),
                                                    color: theme.lightSeaGreen,
                                                    fontSize: '0.82rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                                                    {patient.patientName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatCurrency(patient.pending)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Chip
                                            label={patient.status}
                                            size="small"
                                            sx={getStatusChipStyles(patient.status)}
                                        />
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid item xs={12} xl={4}>
                        <Card sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6">Distribución de citas por estado</Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="center" sx={{ mt: 2 }}>
                                <DashboardDonut
                                    value={reportsData.appointmentStatus.find(item => item.status === 'completada')?.count || 0}
                                    total={reportsData.appointmentStatus.reduce((sum, item) => sum + item.count, 0)}
                                    color={theme.lightSeaGreen}
                                    secondaryColor={alpha(theme.robinEggBlue, 0.45)}
                                    label="citas"
                                />
                                <Stack spacing={1.1} sx={{ width: '100%' }}>
                                    {reportsData.appointmentStatus.map(metric => (
                                        <Stack
                                            key={metric.status}
                                            direction="row"
                                            justifyContent="space-between"
                                            spacing={1.5}
                                            alignItems="center"
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: '50%',
                                                        backgroundColor: getConsultationStatusTone(metric.status).color,
                                                    }}
                                                />
                                                <Typography variant="body2">{metric.label}</Typography>
                                            </Stack>
                                            <Typography variant="body2" fontWeight={700}>
                                                {metric.count} ({metric.percentage}%)
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2.5}>
                    <Grid item xs={12} xl={7}>
                        <Card sx={{ p: 0 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ p: 3, pb: 2 }}>
                                <Box>
                                    <Typography variant="h6">Saldos de pacientes</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        {filteredBalances.length} registros filtrados
                                    </Typography>
                                </Box>
                                <TableSearchField
                                    label="Buscar paciente"
                                    value={balanceSearch}
                                    onChange={(value) => {
                                        setBalanceSearch(value)
                                        setBalancePage(0)
                                    }}
                                />
                            </Stack>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell>DPI/CUI</TableCell>
                                            <TableCell>Última visita</TableCell>
                                            <TableCell align="right">Saldo</TableCell>
                                            <TableCell align="right">Pendiente</TableCell>
                                            <TableCell>Contacto</TableCell>
                                            <TableCell>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedBalances.map(patient => (
                                            <TableRow key={patient.patientId} hover>
                                                <TableCell>{patient.patientName}</TableCell>
                                                <TableCell>{patient.nationalId}</TableCell>
                                                <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                                                <TableCell align="right">{formatCurrency(patient.balance)}</TableCell>
                                                <TableCell align="right">{formatCurrency(patient.pending)}</TableCell>
                                                <TableCell>{patient.contact}</TableCell>
                                                <TableCell>
                                                    <Chip label={patient.status} size="small" sx={getStatusChipStyles(patient.status)} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredBalances.length}
                                page={balancePage}
                                onPageChange={(_event, nextPage) => setBalancePage(nextPage)}
                                rowsPerPage={balancesRowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setBalancesRowsPerPage(Number(event.target.value))
                                    setBalancePage(0)
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </Card>
                    </Grid>

                    <Grid item xs={12} xl={5}>
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
                            <TableContainer sx={{ maxHeight: 580 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Paciente</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                            <TableCell align="right">Pendiente</TableCell>
                                            <TableCell>Estado</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedConsultations.map(consultation => (
                                            <TableRow key={consultation.consultationId} hover>
                                                <TableCell>{formatDate(consultation.date)}</TableCell>
                                                <TableCell>
                                                    <Stack spacing={0.25}>
                                                        <Typography variant="body2">{consultation.patientName}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {consultation.doctorName} · {consultation.siteName}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(consultation.total)}</TableCell>
                                                <TableCell align="right" sx={{ color: consultation.due > 0 ? theme.red : theme.success }}>
                                                    {formatCurrency(consultation.due)}
                                                </TableCell>
                                                <TableCell>
                                                    <ConsultationStatusControl
                                                        consultationId={consultation.consultationId}
                                                        status={consultation.status}
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
                PaperProps={{
                    sx: { mt: 1.5, borderRadius: '18px', minWidth: 220 },
                }}
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
