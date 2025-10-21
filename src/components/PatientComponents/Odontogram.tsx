import { Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

import { Odontogram } from '../Odontogram'

const OdontogramComponent = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <Grid container>
      <Typography variant={'h4'} color={'black'} marginY={2} display={{
        xs: 'block',
        md: 'none'
      }}
      >
        Disponible en version de escritorio :)
      </Typography>
      <Grid item xs={12} padding={0} marginTop={2} display={{
        xs: 'none',
        md: 'block'
      }}
        overflow={'hidden'}
      >
        <Odontogram.App patientId={id as string} />
      </Grid>

    </Grid >
  )
}

export default OdontogramComponent
