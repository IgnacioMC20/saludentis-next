export interface IReportFilters {
    startDate: Date;
    endDate: Date;
    groupBy: 'day' | 'week' | 'month';
    providerId?: string;
    treatmentId?: string;
    patientSearch?: string;
}

export interface IKPIMetrics {
    totalRevenue: number;
    collectedPayments: number;
    outstandingBalances: number;
    pendingCollections: number;
    consultationsCount: number;
    patientsSeen: number;
    newPatients: number;
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
    phone: number;
    email: string;
    status: 'Due' | 'Clear';
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
}

export interface IQuotationMetrics {
    totalQuoted: number;
    convertedAmount: number;
    conversionRate: number;
    quotationsCount: number;
    convertedCount: number;
}

export interface IReportsData {
    kpis: IKPIMetrics;
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