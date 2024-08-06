import { Card } from '@mui/material'

import { PatientTabs } from '@/components'
import { Layout } from '@/layout'

export default function PatientPage() {
    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 1, md: 0 },
                paddingX: { xs: 2, md: 0 },
                width: {
                    xs: '100%',
                },
                height: '670px',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'space-between',
                flexDirection: 'column',
            }}>
                <PatientTabs />
            </Card>
        </Layout>

    )
}