import { Card, Typography } from '@mui/material'
// import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'

import { LoadingSpinner } from '@/components'
import { Layout } from '@/layout'

export default function Reports() {

    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 5 },
                paddingX: { xs: 2, md: 5 },
                width: {
                    xs: '100%',
                },
                height: '700px',
                minHeight: '500px',
                boxShadow: 'none',
            }}>
                <Typography variant='h4' mb={3} align='center'>Reportes</Typography>

                <LoadingSpinner />

            </Card>
        </Layout>
    )
}

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//     return {
//         props: {
//             pageComponentProps
//         }
//     }
// }