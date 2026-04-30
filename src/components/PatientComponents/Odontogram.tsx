import { Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

import { Odontogram } from '../Odontogram'
import { usePatient } from '@/hooks'

const OdontogramComponent = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: patientResponse, isLoading } = usePatient(id as string)
  const odontogramProfile = patientResponse?.data?.odontogramProfile
  const showChildOdontogram = odontogramProfile !== 'adult'

  if (isLoading) {
    return (
      <Grid container justifyContent="center" marginTop={4}>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} alignItems="center" marginTop={1}>
          <Typography variant="subtitle1" color="text.secondary">
            Perfil del paciente:
          </Typography>
          <Chip
            label={odontogramProfile === 'adult' ? 'Adulto' : 'Niño'}
            color={odontogramProfile === 'adult' ? 'info' : 'warning'}
            size="small"
          />
        </Stack>
      </Grid>

      <Typography
        variant={'h4'}
        color={'black'}
        marginY={2}
        display={{
          xs: 'block',
          md: 'none'
        }}
      >
        Disponible en version de escritorio :)
      </Typography>

      <Grid
        item
        xs={12}
        padding={0}
        marginTop={2}
        display={{
          xs: 'none',
          md: 'block'
        }}
        overflow={'hidden'}
      >
        <Odontogram.App patientId={id as string} showChildOdontogram={showChildOdontogram} />
      </Grid>
    </Grid>
  )
}

export default OdontogramComponent
