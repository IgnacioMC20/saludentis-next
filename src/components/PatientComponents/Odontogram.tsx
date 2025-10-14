import { Grid, Typography } from '@mui/material'
import React from 'react'

import { Odontogram } from '../Odontogram'

const OdontogramComponent = () => {
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
        <Odontogram.App />
      </Grid>

    </Grid >
  )
}

export default OdontogramComponent
