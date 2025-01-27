import { db } from '.'
import { cleanResponse } from '@/api'
import { Patient } from '@/models'

export const getPatientById = async (id: string) => {
    await db.connect()
    const patient = await Patient.findById(id).lean()
    await db.disconnect()

    if (!patient) return null
    return cleanResponse(patient)
}

export const getPatients = async () => {
    await db.connect()
    const patients = await Patient.find().lean()
    await db.disconnect()

    if (!patients) return []
    return cleanResponse(patients)
}