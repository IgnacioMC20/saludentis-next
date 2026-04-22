import { Box, Card, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'

import { Table } from '@/components'
import { dbPatient } from '@/database'
import { IPatient } from '@/interfaces'
import { Layout } from '@/layout'
import { getAge } from '@/utils'

interface Props {
    patients: any[]
}

const Pacientes = ({ patients }: Props) => {

    return (
        <Layout>
            <Box
                sx={{
                    minHeight: { xs: 'calc(100dvh - 92px)', md: 'calc(100dvh - 32px)' },
                    height: { xs: 'calc(100dvh - 92px)', md: 'calc(100dvh - 32px)' },
                    display: 'grid',
                    placeItems: 'center',
                    width: '100%',
                    py: 0,
                }}
            >
                <Card sx={{
                    paddingY: { xs: 3, md: 5 },
                    paddingX: { xs: 2, md: 5 },
                    width: '100%',
                    maxWidth: '1120px',
                    mx: 'auto',
                    minHeight: '500px',
                }}>
                    <Typography variant='h4' mb={3} align='center'>Pacientes</Typography>
                    <Table data={patients} />
                </Card>
            </Box>
        </Layout >
    )
}

export default Pacientes

export const getServerSideProps: GetServerSideProps = async () => {
    const patients = await dbPatient.getPatients() as IPatient[]

    const formattedData = patients?.map((patient: IPatient) => {
        return {
            id: patient._id,
            ['Nombre Completo']: `${patient.firstName} ${patient.middleName} ${patient.lastName}`,
            ['Fecha de Nacimiento']: patient.birthDate,
            ['Numero de Telefono']: patient.phone?.toString(),
            ['Edad']: getAge(patient.birthDate?.toString() || ''),
            ['WhatsApp']: true,
        }
    })

    return {
        props: {
            patients: JSON.parse(JSON.stringify(formattedData)) || [],
        },
    }
}
