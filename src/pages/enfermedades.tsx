import { Card, Typography } from '@mui/material'

import { Table } from '@/components'
import { Layout } from '@/layout'

const data = [
    {
        id: '0',
        nombre: 'nombre1',
        detalle: 'detalle1'
    },
    {
        id: '1',
        nombre: 'nombre2',
        detalle: 'detalle2'
    },
    {
        id: '2',
        nombre: 'nombre3',
        detalle: 'detalle3'
    },
    {
        id: '3',
        nombre: 'nombre4',
        detalle: 'detalle4'
    },
    {
        id: '4',
        nombre: 'nombre5',
        detalle: 'detalle5'
    },
    {
        id: '5',
        nombre: 'nombre6',
        detalle: 'detalle6'
    },
    {
        id: '6',
        nombre: 'nombre7',
        detalle: 'detalle7'
    },
    {
        id: '7',
        nombre: 'nombre8',
        detalle: 'detalle8'
    },
    {
        id: '8',
        nombre: 'nombre9',
        detalle: 'detalle9'
    },
    {
        id: '9',
        nombre: 'nombre10',
        detalle: 'detalle10'
    },
    {
        id: '10',
        nombre: 'nombre11',
        detalle: 'detalle11'
    },
    {
        id: '11',
        nombre: 'nombre12',
        detalle: 'detalle12'
    },
    {
        id: '12',
        nombre: 'nombre13',
        detalle: 'detalle13'
    },
    {
        id: '13',
        nombre: 'nombre14',
        detalle: 'detalle14'
    },
    {
        id: '14',
        nombre: 'nombre15',
        detalle: 'detalle15'
    },
    {
        id: '15',
        nombre: 'nombre16',
        detalle: 'detalle16'
    },
    {
        id: '16',
        nombre: 'nombre17',
        detalle: 'detalle17'
    },
    {
        id: '17',
        nombre: 'nombre18',
        detalle: 'detalle18'
    },
    {
        id: '18',
        nombre: 'nombre19',
        detalle: 'detalle19'
    },
    {
        id: '19',
        nombre: 'nombre20',
        detalle: 'detalle20'
    },
    {
        id: '20',
        nombre: 'nombre21',
        detalle: 'detalle21'
    },
]

const Enfermedades = () => {
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
                <Typography variant='h4' mb={3} align='center'>Enfermedades</Typography>
                <Table data={data} />
            </Card>
        </Layout >
    )
}

export default Enfermedades