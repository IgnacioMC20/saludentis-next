import { IPatient } from '@/models/Patient'

export const formatPatientData = (patient: IPatient) => {
    if (!patient)
        return null

    return {
        firstName: patient.firstName || '',
        middleName: patient.middleName || '',
        lastName: patient.lastName || '',
        nationalId: patient.nationalId || '',
        gender: patient.gender || 'Masculino' as 'Masculino' | 'Femenino',
        birthDate: patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '',
        address: patient.address || '',
        email: patient.email || '',
        phone: patient.phone?.toString() || '',
        maritalStatus: patient.maritalStatus ?? 'Soltero' as 'Soltero' | 'Casado' | 'Divorciado' | 'Separado' | 'Unido',
        occupation: patient.occupation || '',
        guardianName: patient.guardianName || '',
        guardianPhone: patient.guardianPhone || '',
        lastVisit: patient.lastVisit
            ? new Date(patient.lastVisit).toISOString().split('T')[0]
            : '',
        lastTreatment: patient.lastTreatment || '',
        consultationReason: patient.consultationReason || '',
    }
}