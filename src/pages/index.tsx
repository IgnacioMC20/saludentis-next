import { Card, CircularProgress, Box, Grid } from '@mui/material'

import { PatientSelect, NewPatient } from '@/components'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { usePatients } from '@/hooks'
import { Layout } from '@/layout'

export default function Home() {
  const { data: patients, isLoading } = usePatients()
  console.group('patients', { data: patients, isLoading })
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
        height: '500px',
        overflow: 'auto',
      }}>
        {
          isLoading ? (
            <LoadingSpinner />
          ) : (
            <Grid container flexDirection={'row'} display={'flex'}>
              <Grid item xs={12} sm={6} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                <NewPatient />
              </Grid>
              <Grid item xs={12} sm={6} display={'flex'} flexDirection={'column'} justifyContent={'center'} padding={0}>
                <PatientSelect />
              </Grid>
            </Grid>
          )
        }
      </Card >
    </Layout >
  )
}
