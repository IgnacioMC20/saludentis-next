import { Edit } from '@mui/icons-material'
import { Card } from '@mui/material'
import { useRouter } from 'next/router'

import { PatientTabs, FloatingActionButton } from '@/components'
import { Layout } from '@/layout'

export default function PatientPage() {

    const router = useRouter()
    const { id, edit } = router.query
    const editFunction = () => {
        const newEditValue = edit !== 'true' ? 'true' : 'false'
        router.push(`/paciente/${id}?edit=${newEditValue}`)
    }

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
            {
                edit !== 'true' &&
                (<FloatingActionButton icon={<Edit color='info' />} func={editFunction} />)
            }
        </Layout>

    )
}