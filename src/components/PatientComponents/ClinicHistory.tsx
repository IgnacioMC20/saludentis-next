import { Grid, TextField, Typography, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React from 'react'

export default function ClinicHistory() {

  return (
    <Grid container spacing={2} padding={0}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">Antecedentes Médicos</Typography>
        <FormGroup >
          {['Enfermedad del corazon', 'Metabolicos', 'Cancer', 'SCI', 'Estreñimiento', 'Gastritis', 'Artritis', 'Renal', 'Gineco obstetricos', 'Quirurgicos', 'Alergias', 'Hemorragias', 'Convulsiones', 'Habitos', 'Otros'].map((label) => (
            <FormControlLabel
              key={label}
              control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, padding: '4px' }} />}
              label={label}
            />
          ))}
        </FormGroup >

      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">Antecedentes Familiares</Typography>
        <FormGroup >
          {['Corazon', 'Metabolicos', 'Cancer', 'Artritis', 'Otros'].map((label) => (
            <FormControlLabel
              key={label}
              control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, padding: '4px' }} />}
              label={label}
            />
          ))}
        </FormGroup>
        <Typography sx={{ mt: 2 }} variant="h5">Antecedentes Odontologicos</Typography>
        <FormGroup >
          {['Hemorragias', 'Infecciones', 'Ulceras', 'Reaccion a la anestesia', 'ATM Derecho', 'ATM Izquierdo', 'Bruxismo', 'Dolor Dental', 'Otros'].map((label) => (
            <FormControlLabel
              key={label}
              control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, padding: '4px' }} />}
              label={label}
            />
          ))}
        </FormGroup>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Antecedentes Médicos</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Antecedentes Familiares</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">Antecedentes Odontológicos</Typography>
          <TextField
            fullWidth
            defaultValue=""
            variant="outlined"
            multiline
            minRows={4}
          />
        </Grid>
        <Grid item xs={12} textAlign={'center'}>
          <Button variant="contained" color="primary">
            <Typography variant='h6'>Guardar</Typography>
          </Button>
        </Grid>

      </Grid>

    </Grid>
    // </Box>
  )
}
