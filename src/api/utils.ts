export function cleanResponse<T extends Record<string, any>>(data: T | T[], timestamps: boolean = false): T | T[] {

    const fieldsToRemove = ['__v', ...(timestamps ? ['createdAt', 'updatedAt'] : [])]

    const removeFields = (obj: T): T => {
        const cleanedObj = { ...obj }
        for (const field of fieldsToRemove) {
            delete cleanedObj[field]
        }
        return cleanedObj
    }

    return Array.isArray(data) ? data.map(item => removeFields(item)) : removeFields(data)
}

