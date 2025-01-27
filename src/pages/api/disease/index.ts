import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database' // Asegúrate de que tengas tu conexión a la base de datos aquí
import Disease from '@/models/Disease'

type Data = {
    ok: boolean;
    message: string;
    data?: any;
    error?: any;
};
const seedData = [
    { id: 1, detail: 'Caries Dental Superficial' },
    { id: 2, detail: 'Caries Dental Profunda' },
    { id: 3, detail: 'Resina Compuesta' },
    { id: 4, detail: 'Filtración Resina Compuesta' },
    { id: 5, detail: 'Amalgama Dental' },
    { id: 6, detail: 'Filtración Amalgama Dental' },
    { id: 7, detail: 'Abración Dental' },
    { id: 8, detail: 'Abfracción Dental' },
    { id: 9, detail: 'Pieza Ausente' },
    { id: 10, detail: 'Mal Pisición Dental' },
    { id: 11, detail: 'Absceso Dental' },
    { id: 12, detail: 'Prótesis Fija' },
    { id: 13, detail: 'Extruido' },
    { id: 14, detail: 'Endodoncia en Buen Estado' },
    { id: 15, detail: 'Endodoncia en Mal Estado' },
    { id: 16, detail: '3ra Molar Retenida' },
    { id: 17, detail: '3ra Molar Inclinada' },
    { id: 18, detail: 'Chasquido' },
    { id: 19, detail: 'Desviación Izquierda' },
    { id: 20, detail: 'Desviación Derecha' },
    { id: 21, detail: 'Dolor Derecha' },
    { id: 22, detail: 'Dolor Izquierda' },
    { id: 23, detail: 'Gingivitis Leve' },
    { id: 24, detail: 'Gingivitis Moderada' },
    { id: 25, detail: 'Gingivitis Severa' },
    { id: 26, detail: 'Periodontitis' },
    { id: 27, detail: 'Diente Sano' },
    { id: 28, detail: 'Detox' },
    { id: 29, detail: 'Consulta' },
    { id: 30, detail: 'Trastorno Neuromuscular' }
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
        await Disease.deleteMany()
        await Disease.insertMany(seedData)
        const diseases = await Disease.find().lean()
        await db.disconnect()

        return res.status(201).json({
            ok: true,
            message: 'Seed data creada exitosamente',
            data: diseases
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
