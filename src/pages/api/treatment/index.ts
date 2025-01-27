import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database' // Asegúrate de que tengas tu conexión a la base de datos aquí
import Treatment from '@/models/Treatment'

type Data = {
    ok: boolean;
    message: string;
    data?: any;
    error?: any;
};
const seedData = [
    { id: 1, description: 'Resina compuesta Una superficie', price: 200.00 },
    { id: 2, description: 'Resina compuesta Dos o más superficies', price: 250.00 },
    { id: 3, description: 'Sellante fosas y fisuras', price: 75.00 },
    { id: 4, description: 'Incrustación', price: 600.00 },
    { id: 5, description: 'Prótesis fija metal porcelana', price: 1000.00 },
    { id: 6, description: 'Prótesis removible acrílico', price: 600.00 },
    { id: 7, description: 'Prótesis removible Valplast', price: 2000.00 },
    { id: 8, description: 'Prótesis removible cromo-cobalto', price: 2000.00 },
    { id: 9, description: 'Prótesis removible híbrida', price: 2700.00 },
    { id: 10, description: 'Prótesis fija E-Max', price: 2000.00 },
    { id: 11, description: 'Prótesis fija Zirconio', price: 2500.00 },
    { id: 12, description: 'Limpieza dental adulto', price: 300.00 },
    { id: 13, description: 'Limpieza dental niño', price: 200.00 },
    { id: 14, description: 'Resina compuesta niño', price: 175.00 },
    { id: 15, description: 'Mantenedor de espacio', price: 500.00 },
    { id: 16, description: 'Pulpotonía', price: 150.00 },
    { id: 17, description: 'Corona de acero', price: 250.00 },
    { id: 18, description: 'Exodoncia', price: 150.00 },
    { id: 19, description: 'Cirugía cordales', price: 850.00 },
    { id: 20, description: 'Tratamiento de coductos uniradicular', price: 800.00 },
    { id: 21, description: 'Tratamiento de coductos multiradicular', price: 1200.00 },
    { id: 22, description: 'Nebulización', price: 150.00 },
    { id: 23, description: 'Terapia Neural', price: 150.00 },
    { id: 24, description: 'Consulta', price: 150.00 },
    { id: 25, description: 'Guarda Oclusal', price: 300.00 },
    { id: 26, description: 'Exodoncia Cordal', price: 200.00 },
    { id: 27, description: 'Cementación Brackets Superior', price: 900.00 },
    { id: 28, description: 'Cementación Brackets Inferior', price: 900.00 },
    { id: 29, description: 'Cita control ortodoncia', price: 250.00 },
]

export default async function seedHandler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            ok: false,
            message: 'Test endpoint - Solo soporta método GET',
        })
    }

    try {
        await db.connect()
        await Treatment.deleteMany()
        await Treatment.insertMany(seedData)
        const treatments = await Treatment.find().lean()
        await db.disconnect()

        return res.status(201).json({
            ok: true,
            message: 'Seed data creada exitosamente',
            data: treatments
        })
    } catch (error: any) {
        console.error(error)
        await db.disconnect()
        return res.status(500).json({
            ok: false,
            message: 'Un error ocurrio al crear la seed data',
            error: error.message,
        })
    }
}
