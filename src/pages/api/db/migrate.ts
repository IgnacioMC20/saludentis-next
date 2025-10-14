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
                action: string
                success: boolean
                error?: string
            }
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
        action, 
        collections 
    } = req.body as { 
        action?: 'sync-indexes' | 'drop-all' | 'recreate-all'
        collections?: string[]
    }

    if (!action) {
        return res.status(400).json({
            ok: false,
            message: 'Action is required. Use "sync-indexes", "drop-all", or "recreate-all".',
        })
    }

    console.log('[DB Migration] Starting migration with action:', action)
    console.log('[DB Migration] Target collections:', collections || 'all')

    await db.connect()

    try {
        const stats: {
            collections: {
                [key: string]: {
                    action: string
                    success: boolean
                    error?: string
                }
            }
        } = { collections: {} }

        const targetCollections = collections || Object.keys(ALL_MODELS)
        const errors: any[] = []

        switch (action) {
            case 'sync-indexes':
                console.log('[DB Migration] Syncing indexes for all models...')
                
                for (const collectionName of targetCollections) {
                    const model = ALL_MODELS[collectionName as keyof typeof ALL_MODELS]
                    
                    if (!model) {
                        console.log(`[DB Migration] Unknown collection: ${collectionName}, skipping`)
                        stats.collections[collectionName] = {
                            action: 'sync-indexes',
                            success: false,
                            error: 'Unknown collection'
                        }
                        continue
                    }

                    try {
                        console.log(`[DB Migration] Syncing indexes for ${collectionName}...`)
                        await model.syncIndexes()
                        console.log(`[DB Migration] ✓ Synced indexes for ${collectionName}`)
                        
                        stats.collections[collectionName] = {
                            action: 'sync-indexes',
                            success: true
                        }
                    } catch (error: any) {
                        console.error(`[DB Migration] ✗ Failed to sync indexes for ${collectionName}:`, error.message)
                        stats.collections[collectionName] = {
                            action: 'sync-indexes',
                            success: false,
                            error: error.message
                        }
                        errors.push({
                            collection: collectionName,
                            action: 'sync-indexes',
                            error: error.message
                        })
                    }
                }
                break

            case 'drop-all':
                console.log('[DB Migration] Dropping all collections...')
                
                for (const collectionName of targetCollections) {
                    const model = ALL_MODELS[collectionName as keyof typeof ALL_MODELS]
                    
                    if (!model) {
                        console.log(`[DB Migration] Unknown collection: ${collectionName}, skipping`)
                        stats.collections[collectionName] = {
                            action: 'drop',
                            success: false,
                            error: 'Unknown collection'
                        }
                        continue
                    }

                    try {
                        console.log(`[DB Migration] Dropping ${collectionName}...`)
                        await model.collection.drop().catch(() => {
                            console.log(`[DB Migration] Collection ${collectionName} does not exist, skipping`)
                        })
                        console.log(`[DB Migration] ✓ Dropped ${collectionName}`)
                        
                        stats.collections[collectionName] = {
                            action: 'drop',
                            success: true
                        }
                    } catch (error: any) {
                        console.error(`[DB Migration] ✗ Failed to drop ${collectionName}:`, error.message)
                        stats.collections[collectionName] = {
                            action: 'drop',
                            success: false,
                            error: error.message
                        }
                        errors.push({
                            collection: collectionName,
                            action: 'drop',
                            error: error.message
                        })
                    }
                }
                break

            case 'recreate-all':
                console.log('[DB Migration] Recreating all collections...')
                
                for (const collectionName of targetCollections) {
                    const model = ALL_MODELS[collectionName as keyof typeof ALL_MODELS]
                    
                    if (!model) {
                        console.log(`[DB Migration] Unknown collection: ${collectionName}, skipping`)
                        stats.collections[collectionName] = {
                            action: 'recreate',
                            success: false,
                            error: 'Unknown collection'
                        }
                        continue
                    }

                    try {
                        console.log(`[DB Migration] Dropping ${collectionName}...`)
                        await model.collection.drop().catch(() => {
                            console.log(`[DB Migration] Collection ${collectionName} does not exist, skipping drop`)
                        })
                        
                        console.log(`[DB Migration] Creating indexes for ${collectionName}...`)
                        await model.createIndexes()
                        console.log(`[DB Migration] ✓ Recreated ${collectionName}`)
                        
                        stats.collections[collectionName] = {
                            action: 'recreate',
                            success: true
                        }
                    } catch (error: any) {
                        console.error(`[DB Migration] ✗ Failed to recreate ${collectionName}:`, error.message)
                        stats.collections[collectionName] = {
                            action: 'recreate',
                            success: false,
                            error: error.message
                        }
                        errors.push({
                            collection: collectionName,
                            action: 'recreate',
                            error: error.message
                        })
                    }
                }
                break

            default:
                await db.disconnect()
                return res.status(400).json({
                    ok: false,
                    message: 'Invalid action. Use "sync-indexes", "drop-all", or "recreate-all".',
                })
        }

        await db.disconnect()

        const successCount = Object.values(stats.collections).filter(c => c.success).length
        const failCount = Object.values(stats.collections).filter(c => !c.success).length

        if (errors.length > 0) {
            return res.status(207).json({
                ok: true,
                message: `Migration completed: ${successCount} succeeded, ${failCount} failed`,
                stats,
                errors
            })
        }

        return res.status(200).json({
            ok: true,
            message: `Migration action "${action}" completed successfully for ${successCount} collection(s)`,
            stats
        })
    } catch (error: any) {
        console.error('[DB Migration] Error:', error)
        await db.disconnect()

        return res.status(500).json({
            ok: false,
            message: error.message || 'Migration failed',
            errors: [error]
        })
    }
}