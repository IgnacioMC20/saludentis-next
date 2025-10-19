import { db } from '.'
import { cleanResponse } from '@/api'
import Disease from '@/models/Disease'

export const getDiseasesyId = async (id: string) => {
    await db.connect()
    const disease = await Disease.findById(id).lean()
    await db.disconnect()

    if (!disease) return null
    return cleanResponse(disease)
}

export const getDiseases = async () => {
    await db.connect()
    const diseases = await Disease.find().lean()
    await db.disconnect()

    if (!diseases) return []
    return cleanResponse(diseases)
}