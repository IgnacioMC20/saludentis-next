export type ConsultationStatus = 'confirmada' | 'completada' | 'cancelada' | 'no_asistio'

export const CONSULTATION_STATUS_OPTIONS: ConsultationStatus[] = [
    'confirmada',
    'completada',
    'cancelada',
    'no_asistio',
]

export const CONSULTATION_STATUS_LABELS: Record<ConsultationStatus, string> = {
    confirmada: 'Confirmadas',
    completada: 'Completadas',
    cancelada: 'Canceladas',
    no_asistio: 'No presentadas',
}

export interface IReportFilters {
    startDate: Date;
    endDate: Date;
    groupBy: 'day' | 'week' | 'month';
    siteName?: string;
    doctorName?: string;
    consultationStatus?: ConsultationStatus | 'todos';
    patientSearch?: string;
}

export interface IKPIMetrics {
    totalRevenue: number;
    collectedPayments: number;
    outstandingBalances: number;
    consultationsCount: number;
    patientsSeen: number;
    newPatients: number;
    pendingCollectionsCount: number;
}

export interface IMetricComparison {
    current: number;
    previous: number;
    deltaPercent: number;
    trend: 'up' | 'down' | 'neutral';
    comparisonLabel: string;
}

export interface IRevenueDataPoint {
    date: string;
    revenue: number;
    collections: number;
}

export interface IARAgingBucket {
    range: string;
    count: number;
    amount: number;
    patients: string[];
}

export interface ITreatmentRevenue {
    treatmentId: string;
    treatmentName: string;
    revenue: number;
    count: number;
}

export interface IPatientBalance {
    patientId: string;
    patientName: string;
    nationalId: string;
    lastVisit: Date | null;
    balance: number;
    pending: number;
    phone: number | null;
    email: string;
    contact: string;
    status: 'Pendiente' | 'Vencido' | 'Crítico' | 'Al día';
    daysPastDue: number;
}

export interface IConsultationRow {
    consultationId: string;
    date: Date;
    patientName: string;
    patientId: string;
    total: number;
    paid: number;
    due: number;
    treatmentsCount: number;
    status: ConsultationStatus;
    doctorName: string;
    siteName: string;
}

export interface IQuotationMetrics {
    totalQuoted: number;
    convertedAmount: number;
    conversionRate: number;
    quotationsCount: number;
    convertedCount: number;
}

export interface IAlertMetrics {
    total: number;
    pendingCollections: number;
    overdueOver90Days: number;
}

export interface IAgeMixMetrics {
    children: number;
    adults: number;
    total: number;
    childrenPercentage: number;
    adultsPercentage: number;
}

export interface IAppointmentStatusMetric {
    status: ConsultationStatus;
    label: string;
    count: number;
    percentage: number;
}

export interface IAvailableReportFilters {
    sites: string[];
    doctors: string[];
    statuses: ConsultationStatus[];
}

export interface IReportsData {
    kpis: IKPIMetrics;
    comparisons: Record<keyof IKPIMetrics, IMetricComparison>;
    alerts: IAlertMetrics;
    ageMix: IAgeMixMetrics;
    appointmentStatus: IAppointmentStatusMetric[];
    availableFilters: IAvailableReportFilters;
    revenueTrend: IRevenueDataPoint[];
    arAging: IARAgingBucket[];
    topTreatments: ITreatmentRevenue[];
    topPatients: IPatientBalance[];
    patientBalances: {
        data: IPatientBalance[];
        total: number;
        page: number;
        pageSize: number;
    };
    consultations: IConsultationRow[];
    quotationFunnel: IQuotationMetrics;
}
