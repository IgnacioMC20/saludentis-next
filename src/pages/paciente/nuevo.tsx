import { Box, Card, Typography } from '@mui/material'

import PacientInfo from '@/components/PatientComponents/PacientInfo'
import { Layout } from '@/layout'

export default function PatientPage() {
    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 4 },
                paddingX: { xs: 2, md: 4 },
                width: {
                    xs: '100%',
                },
                minHeight: '500px',
                height: '700px',
                boxShadow: 'none',
                overflow: 'auto',
            }}>
                <Typography variant='h4' mb={3} align='center'>Nuevo Paciente</Typography>
                <Box sx={{
                    paddingTop: 3,
                    width: '100%',
                }}>
                    <PacientInfo />
                </Box>
            </Card>
        </Layout>

    )
}