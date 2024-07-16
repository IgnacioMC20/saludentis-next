import bcrypt from 'bcryptjs'

import { db } from '.'
import { IUser } from '@/interfaces'
import { User } from '@/models'

export const checkUserEmailPassword = async (email: string, password: string) => {
    await db.connect()
    const user = await User.findOne({ email })
    await db.disconnect()

    if (!user) return null

    if (!bcrypt.compareSync(password, user!.password!)) return null

    const { name, lastName, _id, } = user! as IUser
    return {
        _id,
        email,
        name,
        lastName
    }
}