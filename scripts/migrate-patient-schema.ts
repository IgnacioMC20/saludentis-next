import mongoose, { Model, Schema } from 'mongoose'

type OdontogramProfile = 'adult' | 'child'

type MigrationStats = {
  totalPatients: number
  missingOdontogramProfile: number
  updatedOdontogramProfile: number
  alreadyNormalized: number
  duplicatePlaceholderNationalIds: number
}

type PatientDoc = {
  _id: mongoose.Types.ObjectId
  birthDate?: Date | string
  createdAt?: Date | string
  odontogramProfile?: OdontogramProfile
  nationalId?: string
}

const patientSchema = new Schema<PatientDoc>(
  {
    birthDate: { type: Date },
    createdAt: { type: Date },
    nationalId: { type: String, trim: true, unique: true, sparse: true },
    odontogramProfile: { type: String, enum: ['adult', 'child'] },
  },
  {
    collection: 'patients',
    strict: false,
  }
)

const Patient = (mongoose.models.Patient as Model<PatientDoc>) || mongoose.model<PatientDoc>('Patient', patientSchema)

const args = new Set(process.argv.slice(2))
const shouldApply = args.has('--apply')
const shouldSyncIndexes = args.has('--sync-indexes')

const getOdontogramProfile = (
  birthDate?: Date | string,
  referenceDate?: Date | string
): OdontogramProfile => {
  if (!birthDate) return 'adult'

  const birth = new Date(birthDate)
  const reference = referenceDate ? new Date(referenceDate) : new Date()

  if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
    return 'adult'
  }

  const age = reference.getFullYear() - birth.getFullYear()
  const birthdayPassed =
    reference.getMonth() > birth.getMonth() ||
    (reference.getMonth() === birth.getMonth() && reference.getDate() >= birth.getDate())

  const isAdult = birthdayPassed ? age >= 18 : age - 1 >= 18
  return isAdult ? 'adult' : 'child'
}

const main = async () => {
  const mongoUrl = process.env.MONGO_URL

  if (!mongoUrl) {
    throw new Error('MONGO_URL is required')
  }

  console.log(`[migration] starting patient schema migration in ${shouldApply ? 'apply' : 'dry-run'} mode`)
  if (shouldSyncIndexes) {
    console.log('[migration] index sync enabled')
  }

  await mongoose.connect(mongoUrl)

  try {
    const stats: MigrationStats = {
      totalPatients: 0,
      missingOdontogramProfile: 0,
      updatedOdontogramProfile: 0,
      alreadyNormalized: 0,
      duplicatePlaceholderNationalIds: 0,
    }

    const patients = await Patient.find({}, '_id birthDate createdAt odontogramProfile nationalId').lean()
    stats.totalPatients = patients.length

    for (const patient of patients) {
      if (patient.odontogramProfile) {
        stats.alreadyNormalized++
        continue
      }

      stats.missingOdontogramProfile++

      const odontogramProfile = getOdontogramProfile(patient.birthDate, patient.createdAt)

      if (shouldApply) {
        await Patient.updateOne(
          { _id: patient._id, odontogramProfile: { $exists: false } },
          { $set: { odontogramProfile } }
        )
      }

      stats.updatedOdontogramProfile++
    }

    const duplicateNationalIds = await Patient.aggregate([
      { $match: { nationalId: { $exists: true, $type: 'string', $ne: '' } } },
      { $group: { _id: '$nationalId', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'duplicates' },
    ])

    stats.duplicatePlaceholderNationalIds = duplicateNationalIds[0]?.duplicates || 0

    console.log('[migration] stats')
    console.table(stats)

    if (stats.duplicatePlaceholderNationalIds > 0) {
      console.warn('[migration] duplicate nationalId values detected. Resolve them before syncing indexes.')
    }

    if (shouldApply && shouldSyncIndexes) {
      if (stats.duplicatePlaceholderNationalIds > 0) {
        throw new Error('Cannot sync indexes while duplicate nationalId values exist')
      }

      await Patient.syncIndexes()
      console.log('[migration] patient indexes synced successfully')
    }

    console.log(`[migration] completed in ${shouldApply ? 'apply' : 'dry-run'} mode`)
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((error) => {
  console.error('[migration] failed')
  console.error(error)
  process.exit(1)
})
