import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import Background from '@/models/Background'

export interface MigrationResponse {
    ok: boolean
    message: string
    stats?: {
        totalDocuments: number
        migrated: number
        failed: number
        dropped?: boolean
    }
    errors?: any[]
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

    const { action } = req.body as { action?: 'migrate' | 'drop' | 'drop-and-recreate' }

    if (!action) {
        return res.status(400).json({
            ok: false,
            message: 'Action is required. Use "migrate", "drop", or "drop-and-recreate".',
        })
    }

    console.log('[DB Migration] Starting migration with action:', action)

    await db.connect()

    try {
        let stats = {
            totalDocuments: 0,
            migrated: 0,
            failed: 0,
            dropped: false,
        }

        switch (action) {
            case 'drop':
                console.log('[DB Migration] Dropping backgrounds collection...')
                await Background.collection.drop().catch(() => {
                    console.log('[DB Migration] Collection does not exist, skipping drop')
                })
                stats.dropped = true
                console.log('[DB Migration] Collection dropped successfully')
                break

            case 'drop-and-recreate':
                console.log('[DB Migration] Dropping backgrounds collection...')
                await Background.collection.drop().catch(() => {
                    console.log('[DB Migration] Collection does not exist, skipping drop')
                })
                stats.dropped = true
                
                console.log('[DB Migration] Creating indexes...')
                await Background.createIndexes()
                console.log('[DB Migration] Indexes created successfully')
                break

            case 'migrate':
                console.log('[DB Migration] Migrating existing documents...')
                
                // Get all existing documents
                const existingDocs = await Background.find({}).lean()
                stats.totalDocuments = existingDocs.length
                console.log(`[DB Migration] Found ${stats.totalDocuments} documents to migrate`)

                const errors: any[] = []

                for (const doc of existingDocs) {
                    try {
                        // Check if document already has new schema
                        if (doc.medicalHistory && doc.familyHistory && doc.dentalHistory) {
                            console.log(`[DB Migration] Document ${doc._id} already migrated, skipping`)
                            stats.migrated++
                            continue
                        }

                        // Migrate to new schema
                        await Background.findByIdAndUpdate(doc._id, {
                            $set: {
                                medicalHistory: {
                                    conditions: [],
                                    notes: ''
                                },
                                familyHistory: {
                                    conditions: [],
                                    notes: ''
                                },
                                dentalHistory: {
                                    conditions: [],
                                    notes: ''
                                }
                            },
                            $unset: {
                                typeId: '',
                                hmaId: '',
                                hoaId: '',
                                neuroId: ''
                            }
                        })

                        console.log(`[DB Migration] Migrated document ${doc._id}`)
                        stats.migrated++
                    } catch (error: any) {
                        console.error(`[DB Migration] Failed to migrate document ${doc._id}:`, error)
                        stats.failed++
                        errors.push({
                            documentId: doc._id,
                            error: error.message
                        })
                    }
                }

                if (errors.length > 0) {
                    await db.disconnect()
                    return res.status(207).json({
                        ok: true,
                        message: `Migration completed with ${stats.failed} errors`,
                        stats,
                        errors
                    })
                }
                break

            default:
                await db.disconnect()
                return res.status(400).json({
                    ok: false,
                    message: 'Invalid action. Use "migrate", "drop", or "drop-and-recreate".',
                })
        }

        await db.disconnect()

        return res.status(200).json({
            ok: true,
            message: `Migration action "${action}" completed successfully`,
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