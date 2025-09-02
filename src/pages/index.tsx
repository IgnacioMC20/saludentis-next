import { Card, Grid } from '@mui/material'

import { PatientSelect, NewPatient, LoadingSpinner } from '@/components'
import { usePatients } from '@/hooks'
import { Layout } from '@/layout'

export default function Home() {
  const { isLoading } = usePatients()

  return (
    <Layout>
      <Card sx={{
        padding: { xs: 1, sm: 5 },
        width: {
          xs: '100%',
          sm: '90%',
        },
        maxHeight: {
          xs: '90%',
          sm: '700px',
        },
        height: 'auto',
        overflow: 'auto',
      }}>
        {
          isLoading ? (
            <LoadingSpinner />
          ) : (
            <Grid container flexDirection={'row'} display={'flex'} >
              <Grid item xs={12} sm={6} display={'flex'} justifyContent={'center'} alignItems={'center'} padding={0} flexDirection={'column'} >
                <NewPatient />
              </Grid>
              <Grid item xs={12} sm={6} display={'flex'} justifyContent={'center'} alignItems={'center'} padding={0} flexDirection={'column'} >
                <PatientSelect />
              </Grid>
            </Grid>
          )
        }
        {/* <button onClick={() => toggleModal()}>lol</button> */}
        {/* <Modal open={isModalOpen} handleClose={toggleModal} /> */}
      </Card >
    </Layout >
  )
}
