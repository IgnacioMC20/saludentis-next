import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import Annotation from '@/models/Annotation'
import Background from '@/models/Background'
import Balance from '@/models/Balance'
import Consultation from '@/models/Consultation'
import Disease from '@/models/Disease'
import Guardian from '@/models/Guardian'
import Hma from '@/models/Hma'
import Hoa from '@/models/Hoa'
import IntraoralExam from '@/models/IntraoralExam'
import Neurofocal from '@/models/Neurofocal'
import OralHygiene from '@/models/OralHygiene'
import Patient from '@/models/Patient'
import Quotation from '@/models/Quotation'
import Specialty from '@/models/Specialty'
import Treatment from '@/models/Treatment'
import Type from '@/models/Type'
import User from '@/models/User'

export interface MigrationResponse {
    ok: boolean
    message: string
    stats?: {
        collections: {
            [key: string]: {
                actions: string[]
                success: boolean
                error?: string
            }
        }
        summary: {
            total: number
            succeeded: number
            failed: number
        }
    }
    errors?: any[]
}

// Map of all models
const ALL_MODELS = {
    annotations: Annotation,
    backgrounds: Background,
    balances: Balance,
    consultations: Consultation,
    diseases: Disease,
    guardians: Guardian,
    hmas: Hma,
    hoas: Hoa,
    intraoralexams: IntraoralExam,
    neurofocals: Neurofocal,
    oralhygienes: OralHygiene,
    patients: Patient,
    quotations: Quotation,
    specialties: Specialty,
    treatments: Treatment,
    types: Type,
    users: User,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MigrationResponse>) {
    // Only allow in development or with specific authorization
    if (process.env.NODE_ENV === 'production') {
        const authHeader = req.headers.authorization
        const expectedToken = process.env.MIGRATION_SECRET || 'change-me-in-production'
        
        if (authHeader !== `Bearer ${expectedToken}`) {
            return res.status(403).json({
                ok: false,
                message: 'Unauthorized. Migration endpoint requires authorization in production.',
            })
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            ok: false,
            message: 'Method not allowed. Use POST.',
        })
    }

    const { 
        actions,
        collections 
    } = req.body as { 
        actions?: ('sync-indexes' | 'drop' | 'recreate' | 'migrate-background')[]
        collections?: string[]
    }

    if (!actions || actions.length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'Actions array is required. Use one or more of: "sync-indexes", "drop", "recreate", "migrate-background".',
        })
    }

    console.log('[DB Migration All] Starting migration with actions:', actions)
    console.log('[DB Migration All] Target collections:', collections || 'all')

    await db.connect()

    try {
        const stats: {
            collections: {
                [key: string]: {
                    actions: string[]
                    success: boolean
                    error?: string
                }
            }
            summary: {
                total: number
                succeeded: number
                failed: number
            }
        } = { 
            collections: {},
            summary: { total: 0, succeeded: 0, failed: 0 }
        }

        const targetCollections = collections || Object.keys(ALL_MODELS)
        const errors: any[] = []

        // Process each collection
        for (const collectionName of targetCollections) {
            const model = ALL_MODELS[collectionName as keyof typeof ALL_MODELS]
            
            if (!model) {
                console.log(`[DB Migration All] Unknown collection: ${collectionName}, skipping`)
                stats.collections[collectionName] = {
                    actions: [],
                    success: false,
                    error: 'Unknown collection'
                }
                stats.summary.total++
                stats.summary.failed++
                continue
            }

            stats.collections[collectionName] = {
                actions: [],
                success: true
            }
            stats.summary.total++

            try {
                // Execute actions in order
                for (const action of actions) {
                    console.log(`[DB Migration All] Executing ${action} for ${collectionName}...`)

                    switch (action) {
                        case 'drop':
                            await model.collection.drop().catch(() => {
                                console.log(`[DB Migration All] Collection ${collectionName} does not exist, skipping drop`)
                            })
                            stats.collections[collectionName].actions.push('dropped')
                            console.log(`[DB Migration All] ✓ Dropped ${collectionName}`)
                            break

                        case 'recreate':
                            // Drop first
                            await model.collection.drop().catch(() => {
                                console.log(`[DB Migration All] Collection ${collectionName} does not exist, skipping drop`)
                            })
                            // Then create indexes
                            await model.createIndexes()
                            stats.collections[collectionName].actions.push('recreated')
                            console.log(`[DB Migration All] ✓ Recreated ${collectionName}`)
                            break

                        case 'sync-indexes':
                            await model.syncIndexes()
                            stats.collections[collectionName].actions.push('synced-indexes')
                            console.log(`[DB Migration All] ✓ Synced indexes for ${collectionName}`)
                            break

                        case 'migrate-background':
                            // Only apply to backgrounds collection
                            if (collectionName === 'backgrounds') {
                                const existingDocs = await Background.find({}).lean()
                                let migrated = 0
                                
                                for (const doc of existingDocs) {
                                    // Check if already migrated
                                    if (doc.medicalHistory && doc.familyHistory && doc.dentalHistory) {
                                        continue
                                    }

                                    // Migrate to new schema
                                    await Background.findByIdAndUpdate(doc._id, {
                                        $set: {
                                            medicalHistory: { conditions: [], notes: '' },
                                            familyHistory: { conditions: [], notes: '' },
                                            dentalHistory: { conditions: [], notes: '' }
                                        },
                                        $unset: {
                                            typeId: '',
                                            hmaId: '',
                                            hoaId: '',
                                            neuroId: ''
                                        }
                                    })
                                    migrated++
                                }
                                
                                stats.collections[collectionName].actions.push(`migrated-${migrated}-docs`)
                                console.log(`[DB Migration All] ✓ Migrated ${migrated} background documents`)
                            } else {
                                console.log(`[DB Migration All] Skipping migrate-background for ${collectionName}`)
                            }
                            break

                        default:
                            console.log(`[DB Migration All] Unknown action: ${action}`)
                    }
                }

                stats.summary.succeeded++
            } catch (error: any) {
                console.error(`[DB Migration All] ✗ Failed for ${collectionName}:`, error.message)
                stats.collections[collectionName].success = false
                stats.collections[collectionName].error = error.message
                stats.summary.failed++
                errors.push({
                    collection: collectionName,
                    actions,
                    error: error.message
                })
            }
        }

        await db.disconnect()

        if (errors.length > 0) {
            return res.status(207).json({
                ok: true,
                message: `Migration completed: ${stats.summary.succeeded} succeeded, ${stats.summary.failed} failed`,
                stats,
                errors
            })
        }

        return res.status(200).json({
            ok: true,
            message: `Migration completed successfully for ${stats.summary.succeeded} collection(s)`,
            stats
        })
    } catch (error: any) {
        console.error('[DB Migration All] Error:', error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Migration failed',
            errors: [error]
        })
    }
}