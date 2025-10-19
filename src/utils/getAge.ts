export const getAge = (birthDate: string): string | null => {
    const birth = new Date(birthDate)

    // Check if the date is valid
    if (isNaN(birth.getTime())) {
        return null
    }

    const today = new Date()
    const years = today.getFullYear() - birth.getFullYear()
    const months = today.getMonth() - birth.getMonth()
    const days = today.getDate() - birth.getDate()

    let age: string

    if (years > 0 || (years === 0 && months >= 0 && days >= 0)) {
        age = `${years} year${years > 1 ? 's' : ''}`
    } else {
        const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + months
        age = `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`
    }

    return age
}

export function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString) // Convertir la cadena a un objeto Date

    // Extraer día, mes y año
    const day = String(date.getUTCDate()).padStart(2, '0') // Asegura dos dígitos
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Meses comienzan en 0
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}` // Retorna la fecha en formato dd/mm/yyyy
}
