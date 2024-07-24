import { Card, Typography } from '@mui/material'

import { Table } from '@/components'
import { Layout } from '@/layout'

const data = [
    {
        id: '0',
        detalle: 'nombre1',
        precio: 10,
    },
    {
        id: '1',
        detalle: 'nombre2',
        precio: 15,

    },
    {
        id: '2',
        detalle: 'nombre3',
        precio: 20,
    },
    {
        id: '3',
        detalle: 'nombre4',
        precio: 25,
    },
    {
        id: '4',
        detalle: 'nombre5',
        precio: 30,
    },
    {
        id: '5',
        detalle: 'nombre6',
        precio: 35,
    },
    {
        id: '6',
        detalle: 'nombre7',
        precio: 40,
    },
    {
        id: '7',
        detalle: 'nombre8',
        precio: 45,
    },
    {
        id: '8',
        detalle: 'nombre9',
        precio: 50,
    },
    {
        id: '9',
        detalle: 'nombre10',
        precio: 55,
    },
    {
        id: '10',
        detalle: 'nombre11',
        precio: 60,
    },
]

const Tratamientos = () => {
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
                <Typography variant='h4' mb={3} align='center'>Tratamientos</Typography>
                <Table data={data} />
            </Card>
        </Layout >
    )
}

export default Tratamientos