import { db } from '.'
import { cleanResponse } from '@/api'
import Treatment from '@/models/Treatment'

export const getTreatmentById = async (id: string) => {
    await db.connect()
    const treatment = await Treatment.findById(id).lean()
    await db.disconnect()

    if (!treatment) return null
    return cleanResponse(treatment)
}

export const getTreatments = async () => {
    await db.connect()
    const treatments = await Treatment.find().lean()
    await db.disconnect()

    if (!treatments) return []
    return cleanResponse(treatments)
}