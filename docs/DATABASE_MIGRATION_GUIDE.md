# Database Migration Guide

## Overview

This guide explains how to use the migration endpoints to manage database schema changes and refresh collections.

## Migration Endpoints

### 1. General Migration (All Collections)
**URL**: `POST /api/db/migrate`

Manages all collections in the database at once.

### 2. Background-Specific Migration
**URL**: `POST /api/db/migrate-background`

Specialized endpoint for Background collection with data migration support.

---

## General Database Migration (`/api/db/migrate`)

### Available Actions

#### 1. Sync Indexes
Synchronizes indexes for all or specific collections without dropping data.

**Use Case**: After model changes, ensure indexes are up to date

```bash
# Sync all collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "sync-indexes"}'

# Sync specific collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sync-indexes",
    "collections": ["patients", "consultations", "backgrounds"]
  }'
```

**Response**:
```json
{
  "ok": true,
  "message": "Migration action \"sync-indexes\" completed successfully for 17 collection(s)",
  "stats": {
    "collections": {
      "patients": { "action": "sync-indexes", "success": true },
      "consultations": { "action": "sync-indexes", "success": true },
      "backgrounds": { "action": "sync-indexes", "success": true }
    }
  }
}
```

#### 2. Drop All Collections
Drops all or specific collections completely.

**Use Case**: Fresh start in development

```bash
# Drop all collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "drop-all"}'

# Drop specific collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "drop-all",
    "collections": ["backgrounds", "types", "hmas", "hoas"]
  }'
```

#### 3. Recreate All Collections
Drops and recreates collections with proper indexes.

**Use Case**: Clean slate with correct schema

```bash
# Recreate all collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "recreate-all"}'

# Recreate specific collections
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "recreate-all",
    "collections": ["backgrounds"]
  }'
```

### Available Collections

- `annotations`
- `backgrounds`
- `balances`
- `consultations`
- `diseases`
- `guardians`
- `hmas`
- `hoas`
- `intraoralexams`
- `neurofocals`
- `oralhygienes`
- `patients`
- `quotations`
- `specialties`
- `treatments`
- `types`
- `users`

---

## Background-Specific Migration (`/api/db/migrate-background`)

**Authorization** (Production only):
- Header: `Authorization: Bearer YOUR_MIGRATION_SECRET`
- Set `MIGRATION_SECRET` in your `.env` file

## Available Actions

### 1. Drop Collection
Completely removes the backgrounds collection.

**Use Case**: Fresh start in development

```bash
curl -X POST http://localhost:3000/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -d '{"action": "drop"}'
```

**Response**:
```json
{
  "ok": true,
  "message": "Migration action \"drop\" completed successfully",
  "stats": {
    "totalDocuments": 0,
    "migrated": 0,
    "failed": 0,
    "dropped": true
  }
}
```

---

### 2. Drop and Recreate
Drops the collection and recreates indexes.

**Use Case**: Clean slate with proper indexes

```bash
curl -X POST http://localhost:3000/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -d '{"action": "drop-and-recreate"}'
```

**Response**:
```json
{
  "ok": true,
  "message": "Migration action \"drop-and-recreate\" completed successfully",
  "stats": {
    "totalDocuments": 0,
    "migrated": 0,
    "failed": 0,
    "dropped": true
  }
}
```

---

### 3. Migrate Existing Data
Migrates existing documents from old schema to new schema.

**Use Case**: Production migration with data preservation

**Old Schema**:
```typescript
{
  typeId: ObjectId,
  hmaId: ObjectId,
  hoaId: ObjectId,
  neuroId: ObjectId,
  patientId: ObjectId
}
```

**New Schema**:
```typescript
{
  patientId: ObjectId,
  medicalHistory: { conditions: [], notes: '' },
  familyHistory: { conditions: [], notes: '' },
  dentalHistory: { conditions: [], notes: '' }
}
```

```bash
curl -X POST http://localhost:3000/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -d '{"action": "migrate"}'
```

**Response**:
```json
{
  "ok": true,
  "message": "Migration action \"migrate\" completed successfully",
  "stats": {
    "totalDocuments": 15,
    "migrated": 15,
    "failed": 0,
    "dropped": false
  }
}
```

**With Errors**:
```json
{
  "ok": true,
  "message": "Migration completed with 2 errors",
  "stats": {
    "totalDocuments": 15,
    "migrated": 13,
    "failed": 2,
    "dropped": false
  },
  "errors": [
    {
      "documentId": "507f1f77bcf86cd799439011",
      "error": "Validation failed"
    }
  ]
}
```

---

## Using with Postman/Thunder Client

### Request Setup

1. **Method**: POST
2. **URL**: `http://localhost:3000/api/db/migrate-background`
3. **Headers**:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_SECRET` (production only)
4. **Body** (raw JSON):
   ```json
   {
     "action": "drop-and-recreate"
   }
   ```

---

## Production Setup

### 1. Add Migration Secret to `.env`

```env
MIGRATION_SECRET=your-super-secret-migration-key-here
```

### 2. Run Migration with Authorization

```bash
curl -X POST https://your-domain.com/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-super-secret-migration-key-here" \
  -d '{"action": "migrate"}'
```

---

## Migration Workflow

### Development Environment

```bash
# 1. Drop old collection
curl -X POST http://localhost:3000/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -d '{"action": "drop"}'

# 2. Test the new schema by creating a background record through the UI
# Navigate to a patient's "Ficha Clínica" tab and save data

# 3. Verify in MongoDB
# Check that the new schema is created correctly
```

### Production Environment

```bash
# 1. Backup your database first!
mongodump --db your-database --collection backgrounds --out ./backup

# 2. Run migration to preserve existing data
curl -X POST https://your-domain.com/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret" \
  -d '{"action": "migrate"}'

# 3. Verify migration results
# Check the response for any errors

# 4. Test the application
# Verify that existing patients can view/edit their clinic history
```

---

## Troubleshooting

### Error: "Unauthorized"
- **Cause**: Missing or incorrect authorization header in production
- **Solution**: Add correct `Authorization: Bearer YOUR_SECRET` header

### Error: "Method not allowed"
- **Cause**: Using GET instead of POST
- **Solution**: Use POST method

### Error: "Action is required"
- **Cause**: Missing or invalid action in request body
- **Solution**: Include valid action: "migrate", "drop", or "drop-and-recreate"

### Migration Fails for Some Documents
- **Cause**: Data validation errors or corrupted documents
- **Solution**: Check the `errors` array in response, fix documents manually

---

## Console Logs

The migration endpoint provides detailed console logs:

```
[DB Migration] Starting migration with action: drop-and-recreate
[DB Migration] Dropping backgrounds collection...
[DB Migration] Collection dropped successfully
[DB Migration] Creating indexes...
[DB Migration] Indexes created successfully
```

For migrate action:
```
[DB Migration] Starting migration with action: migrate
[DB Migration] Migrating existing documents...
[DB Migration] Found 15 documents to migrate
[DB Migration] Document 507f1f77bcf86cd799439011 already migrated, skipping
[DB Migration] Migrated document 507f1f77bcf86cd799439012
...
```

---

## Security Notes

1. **Development**: No authorization required
2. **Production**: Requires `Authorization` header with `MIGRATION_SECRET`
3. **Best Practice**: Use strong, random secret for `MIGRATION_SECRET`
4. **Recommendation**: Disable or remove endpoint after migration in production

---

## Quick Reference

| Action | Use Case | Data Loss | Requires Auth (Prod) |
|--------|----------|-----------|---------------------|
| `drop` | Fresh start | ✅ Yes | ✅ Yes |
| `drop-and-recreate` | Clean slate with indexes | ✅ Yes | ✅ Yes |
| `migrate` | Preserve existing data | ❌ No | ✅ Yes |

---

## Related Files

- Migration Endpoint: [`src/pages/api/db/migrate-background.ts`](../src/pages/api/db/migrate-background.ts)
- Background Model: [`src/models/Background.ts`](../src/models/Background.ts)
- Implementation Plan: [`CLINIC_HISTORY_IMPLEMENTATION_PLAN.md`](./CLINIC_HISTORY_IMPLEMENTATION_PLAN.md)

---

## Quick Reference

### General Migration (`/api/db/migrate`)

| Action | Use Case | Data Loss | Scope | Requires Auth (Prod) |
|--------|----------|-----------|-------|---------------------|
| `sync-indexes` | Update indexes | ❌ No | All or specific | ✅ Yes |
| `drop-all` | Fresh start | ✅ Yes | All or specific | ✅ Yes |
| `recreate-all` | Clean slate | ✅ Yes | All or specific | ✅ Yes |

### Background Migration (`/api/db/migrate-background`)

| Action | Use Case | Data Loss | Requires Auth (Prod) |
|--------|----------|-----------|---------------------|
| `drop` | Fresh start | ✅ Yes | ✅ Yes |
| `drop-and-recreate` | Clean slate with indexes | ✅ Yes | ✅ Yes |
| `migrate` | Preserve existing data | ❌ No | ✅ Yes |

---

## Common Workflows

### After Schema Changes (Development)
```bash
# Option 1: Sync indexes only (preserves data)
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "sync-indexes"}'

# Option 2: Fresh start (drops all data)
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "recreate-all"}'
```

### After Background Model Changes
```bash
# Drop and recreate just the backgrounds collection
curl -X POST http://localhost:3000/api/db/migrate \
  -H "Content-Type: application/json" \
  -d '{
    "action": "recreate-all",
    "collections": ["backgrounds"]
  }'
```

### Production Deployment
```bash
# 1. Backup database first!
mongodump --db your-database --out ./backup-$(date +%Y%m%d)

# 2. Sync indexes for all collections
curl -X POST https://your-domain.com/api/db/migrate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret" \
  -d '{"action": "sync-indexes"}'

# 3. Migrate background data if needed
curl -X POST https://your-domain.com/api/db/migrate-background \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret" \
  -d '{"action": "migrate"}'
```

---

## Related Files

- General Migration: [`src/pages/api/db/migrate.ts`](../src/pages/api/db/migrate.ts)
- Background Migration: [`src/pages/api/db/migrate-background.ts`](../src/pages/api/db/migrate-background.ts)
- Background Model: [`src/models/Background.ts`](../src/models/Background.ts)
- Implementation Plan: [`CLINIC_HISTORY_IMPLEMENTATION_PLAN.md`](./CLINIC_HISTORY_IMPLEMENTATION_PLAN.md)

---

## 🚀 Ultimate Migration Endpoint (`/api/db/migrate-all`)

### The All-in-One Solution

This endpoint combines ALL migration capabilities in a single request. You can execute multiple actions in sequence on all or specific collections.

### Request Format

```bash
POST /api/db/migrate-all
Body: {
  "actions": ["drop", "recreate", "sync-indexes"],
  "collections": ["backgrounds", "patients"]  // optional
}
```

### Available Actions

- `drop` - Drop collections
- `recreate` - Drop and recreate with indexes
- `sync-indexes` - Sync indexes without dropping
- `migrate-background` - Migrate background data (only for backgrounds collection)

### Examples

#### 1. Complete Database Reset
```bash
curl -X POST http://localhost:3000/api/db/migrate-all \
  -H "Content-Type: application/json" \
  -d '{
    "actions": ["drop", "recreate"]
  }'
```

#### 2. Drop and Recreate Specific Collections
```bash
curl -X POST http://localhost:3000/api/db/migrate-all \
  -H "Content-Type: application/json" \
  -d '{
    "actions": ["drop", "recreate"],
    "collections": ["backgrounds", "types", "hmas", "hoas"]
  }'
```

#### 3. Migrate Background Data and Sync All Indexes
```bash
curl -X POST http://localhost:3000/api/db/migrate-all \
  -H "Content-Type: application/json" \
  -d '{
    "actions": ["migrate-background", "sync-indexes"]
  }'
```

#### 4. Complete Background Migration Workflow
```bash
# Drop old collections, recreate backgrounds, migrate data, sync indexes
curl -X POST http://localhost:3000/api/db/migrate-all \
  -H "Content-Type: application/json" \
  -d '{
    "actions": ["drop", "recreate", "migrate-background", "sync-indexes"],
    "collections": ["backgrounds"]
  }'
```

### Response Format

```json
{
  "ok": true,
  "message": "Migration completed successfully for 17 collection(s)",
  "stats": {
    "collections": {
      "backgrounds": {
        "actions": ["dropped", "recreated", "migrated-5-docs", "synced-indexes"],
        "success": true
      },
      "patients": {
        "actions": ["dropped", "recreated", "synced-indexes"],
        "success": true
      }
    },
    "summary": {
      "total": 17,
      "succeeded": 17,
      "failed": 0
    }
  }
}
```

### Action Execution Order

Actions are executed in the order specified in the array:
1. `drop` - Removes collection
2. `recreate` - Drops and creates with indexes
3. `migrate-background` - Migrates data (backgrounds only)
4. `sync-indexes` - Updates indexes

**Recommended Order**: `["drop", "recreate", "migrate-background", "sync-indexes"]`

### Use Cases

| Scenario | Actions | Collections |
|----------|---------|-------------|
| Fresh database | `["drop", "recreate"]` | All (omit) |
| Update indexes only | `["sync-indexes"]` | All (omit) |
| Reset specific collections | `["drop", "recreate"]` | Specify list |
| Migrate backgrounds | `["migrate-background", "sync-indexes"]` | `["backgrounds"]` |
| Complete reset + migrate | `["drop", "recreate", "migrate-background"]` | All (omit) |
