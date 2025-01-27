import { Card, Typography } from '@mui/material'
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
                <Table data={patients} />
            </Card>
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