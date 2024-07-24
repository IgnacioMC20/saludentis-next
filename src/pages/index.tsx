import { Card, Grid } from '@mui/material'

import { PatientSelect, NewPatient } from '@/components'
import { Layout } from '@/layout'

export default function Home() {
  return (
    <Layout>
      <Card sx={{
        padding: { xs: 1, sm: 5 },
        width: {
          xs: '100%',
          sm: '80%',
        },
        maxHeight: {
          xs: '90%',
          sm: '700px',
        },
        overflow: 'auto',
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
  )
}
