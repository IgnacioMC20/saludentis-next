import { Card, Grid } from '@mui/material'
import Head from 'next/head'

import { PatientSelect, NewPatient } from '@/components'
import { Layout } from '@/layout'

export default function Home() {
  return (
    <>
      <Head>
        <title>Saludentis App</title>
        <meta name='description' content='Saludentis App' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/saludentis.ico' />
      </Head>
      <Layout>
        <Card sx={{
          padding: 5,
          width: {
            xs: '100%',
            sm: '80%',
          },
        }}>
          <Grid container flexDirection={'row'} display={'flex'}>
            <Grid item xs={12} sm={6} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
              <NewPatient />
            </Grid>
            <Grid item xs={12} sm={6} display={'flex'} flexDirection={'column'} justifyContent={'center'} padding={0}>
              <PatientSelect />
            </Grid>
          </Grid>
        </Card>
      </Layout >
    </>
  )
}
