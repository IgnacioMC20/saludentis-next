import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Data = ['Riñon y vegija', 'Hígado y vesicula', 'Pulmón e intestino grueso', 'Brazo, estómago y páncreas', 'Corazón, intestino delgado y sistema nervioso']

const Diet = () => {
  return (
    <Grid container spacing={2} height={'100%'}>
      <Grid item xs={12} md={6}>
        <FormGroup>
          {
            Data.map((label) => (
              <FormControlLabel
                key={label}
                control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, padding: '4px' }} />}
                label={label}
              />
            ))
          }
        </FormGroup>
      </Grid>
      <Grid item xs={12} md={6} textAlign={'center'} marginTop={2} padding={0}>
        {/* TODO: create mobile img */}
        <Image priority src="/odontologia_neurofocal.png" alt="odontologia_neurofocal" width={350} height={200} />
      </Grid>
      <Grid container>
        <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
          <Typography variant="h6">Dieta</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={4}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
          <Typography variant="h6">Estado de Ánimo</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={4}
          />
        </Grid>
        <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
          <Typography variant="h6">Actividad Física</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={4}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} textAlign={'center'}>
        <Button variant="contained" color="primary">
          <Typography variant='h6'>Guardar</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default Diet
