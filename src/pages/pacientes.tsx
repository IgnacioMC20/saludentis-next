import { Card, Typography } from '@mui/material'

import { Table } from '@/components'
import { Layout } from '@/layout'

const data = [
    {
        id: '0',
        nombreCompleto: 'nombre1',
        numeroTelefonico: 'telefono',
        whatsapp: true,
        fechaNacimiento: 'fecha',
    },
    {
        id: '1',
        nombreCompleto: 'nombre2',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono',
        whatsapp: true
    },
    {
        whatsapp: true,
        id: '2',
        nombreCompleto: 'nombre3',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        whatsapp: true,
        id: '3',
        nombreCompleto: 'nombre4',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        whatsapp: true,
        id: '4',
        nombreCompleto: 'nombre5',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        whatsapp: true,
        id: '5',
        nombreCompleto: 'nombre6',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '6',
        nombreCompleto: 'nombre7',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '7',
        nombreCompleto: 'nombre8',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '8',
        nombreCompleto: 'nombre9',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '9',
        nombreCompleto: 'nombre10',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '10',
        nombreCompleto: 'nombre11',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '11',
        nombreCompleto: 'nombre12',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '12',
        nombreCompleto: 'nombre13',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '13',
        nombreCompleto: 'nombre14',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    },
    {
        id: '14',
        nombreCompleto: 'nombre15',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono',
        whatsapp: true
    },
    {
        id: '15',
        nombreCompleto: 'nombre16',
        fechaNacimiento: 'fecha',
        numeroTelefonico: 'telefono'
    }
]

const Pacientes = () => {

    const formatedData = data.map((item) => ({
        ...item,
        edad: '24 años',
    }))

    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 5 },
                paddingX: { xs: 2, md: 5 },
                width: {
                    xs: '100%',
                },
                minHeight: '500px',
                boxShadow: 'none',
            }}>
                <Typography variant='h4' mb={3} align='center'>Pacientes</Typography>
                <Table data={formatedData} />
            </Card>
        </Layout >
    )
}

export default Pacientes