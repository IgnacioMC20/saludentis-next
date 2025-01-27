import { Card, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'

import { Table } from '@/components/ui/Table'
import { dbDisease } from '@/database'
import { IDisease } from '@/interfaces'
import { Layout } from '@/layout'

interface Props {
    diseases: any[]
}
const Enfermedades = ({ diseases }: Props) => {
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
                <Table data={diseases} />
            </Card>
        </Layout >
    )
}

export default Enfermedades

export const getServerSideProps: GetServerSideProps = async () => {
    const diseases = await dbDisease.getDiseases() as IDisease[]

    const formattedData = diseases?.map((treatment: IDisease) => {
        return {
            id: treatment._id,
            ['Descripción']: treatment.detail,
        }
    })

    return {
        props: {
            diseases: JSON.parse(JSON.stringify(formattedData)) || [],
        },
    }
}