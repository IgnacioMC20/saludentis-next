import { db } from '.'
import { Patient } from '@/models'

export const getPatientById = async (id: string) => {
    await db.connect()
    const patient = await Patient.findById(id)
    await db.disconnect()

    if (!patient) return null
    console.log('patient', patient)
    // const { name, lastName, _id, } = patient!
    return patient
}