import { Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'

const Diagnostic = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
        <Typography variant="h6">Diagnóstico</Typography>
        <TextField
          fullWidth
          defaultValue=""
          variant="outlined"
          multiline
          minRows={4}
        />
      </Grid>
      <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
        <Typography variant="h6">Medicamentos Recetados</Typography>
        <TextField
          fullWidth
          defaultValue=""
          variant="outlined"
          multiline
          minRows={4}
        />
      </Grid>
      <Grid item xs={12} textAlign={'center'} marginTop={3}>
        <Button variant="contained" color="primary">
          <Typography variant='h6'>Guardar</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default Diagnostic
