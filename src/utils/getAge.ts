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
