import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'

/**
 * Formats a date to dd-MMM-yyyy format (e.g., 22-Oct-2025)
 * @param date - Date object, string, or undefined
 * @returns Formatted date string or 'N/A' if date is invalid
 */
export const formatDateToDDMMMYYYY = (date?: Date | string): string => {
    if (!date) return 'N/A'
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return format(dateObj, 'dd-MMM-yyyy', { locale: es })
    } catch (error) {
        console.error('Error formatting date:', error)
        return 'N/A'
    }
}