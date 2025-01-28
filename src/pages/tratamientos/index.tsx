import { Card, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'

import { Table } from '@/components/ui/Table'
import { dbTreatment } from '@/database'
import { ITreatment } from '@/interfaces'
import { Layout } from '@/layout'

interface Props {
    treatments: any[]
}
const Tratamientos = ({ treatments }: Props) => {
    const fetchTreatment = async (url: string, id: string) => {

    }
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
                <Table data={treatments} fetchFunc={fetchTreatment} />
            </Card>
        </Layout >
    )
}

export default Tratamientos

export const getServerSideProps: GetServerSideProps = async () => {
    const treatments = await dbTreatment.getTreatments() as ITreatment[]

    const formattedData = treatments?.map((treatment: ITreatment) => {
        return {
            id: treatment._id,
            ['Descripción']: treatment.description,
            ['Precio']: treatment.price,
        }
    })

    return {
        props: {
            treatments: JSON.parse(JSON.stringify(formattedData)) || [],
        },
    }
}