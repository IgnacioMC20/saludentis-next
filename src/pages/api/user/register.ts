import bcrypt from 'bcryptjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database'
import { IUserApi } from '@/interfaces'
import { User } from '@/models'
import { jwt, validations } from '@/utils'

type Data = {
    message?: string
    token?: string
    user?: IUserApi
    ok: boolean
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            return res.status(400).json({
                ok: false,
                message: 'Bad Request'
            })
    }
}
// Todo: hacer mas validaciones
const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '', lastName = '' } = req.body
    console.log('===registerUser', { email, password, name, lastName })

    if (password.length < 6) {
        return res.status(400).json({
            ok: false,
            message: 'La contraseña debe ser mas de 5 caracteres'
        })
    }

    if (name.length < 3) {
        return res.status(400).json({
            ok: false,
            message: 'El nombre no parece ser valido'
        })
    }

    if (lastName.length < 3) {
        return res.status(400).json({
            ok: false,
            message: 'El apellido no parece ser valido'
        })
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({
            ok: false,
            message: 'El correo no es valido'
        })
    }

    await db.connect()
    const user = await User.findOne({ email })

    if (user) {
        await db.disconnect()
        return res.status(400).json({
            ok: false,
            message: 'El correo electronico ya existe'
        })
    }

    const newUser = new User({
        name,
        lastName,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password)
    })

    try {
        await newUser.save({ validateBeforeSave: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Revisar logs del servidor'
        })
    }

    const { _id } = newUser

    return res.status(200).json({
        ok: true,
        token: jwt.signToken(_id),
        user: {
            email,
            name,
            lastName
        }
    })
}
