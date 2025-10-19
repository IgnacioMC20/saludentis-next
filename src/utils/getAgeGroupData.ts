import { IPatient } from '@/interfaces'

interface ChartData {
    id: number;
    value: number;
    label: string;
}

export const getAgeGroupData = (patients: IPatient | IPatient[]): ChartData[] => {
    const data = [
        { id: 0, value: 0, label: 'Niños' },
        { id: 1, value: 0, label: 'Adultos' }
    ]

    const isAdult = (birthDate: Date | string | undefined): boolean => {
        if (!birthDate) return false

        const dateOfBirth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate

        if (isNaN(dateOfBirth.getTime())) return false

        const today = new Date()
        const age = today.getFullYear() - dateOfBirth.getFullYear()
        const isBirthdayPassed =
            today.getMonth() > dateOfBirth.getMonth() ||
            (today.getMonth() === dateOfBirth.getMonth() && today.getDate() >= dateOfBirth.getDate())
        return isBirthdayPassed ? age >= 18 : age - 1 >= 18
    }

    const processPatient = (patient: IPatient) => {
        const groupIndex = isAdult(patient.birthDate) ? 1 : 0
        data[groupIndex].value += 1
    }

    if (Array.isArray(patients)) {
        patients.forEach(processPatient)
    } else {
        processPatient(patients)
    }

    return data
}
