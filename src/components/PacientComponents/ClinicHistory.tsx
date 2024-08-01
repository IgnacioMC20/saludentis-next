import { Box, Grid, TextField, Typography, Button, FormGroup, FormControlLabel, Checkbox, styled } from '@mui/material'
import React from 'react'
// import Checkbox from '@mui/material/Checkbox';

export default function ClinicHistory() {

  const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    padding: 1
  }))

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Antecedentes Médicos</Typography>
          <FormGroup >
            {['Enfermedad del corazon', 'Metabolicos', 'Cancer', 'SCI', 'Estreñimiento', 'Gastritis', 'Artritis', 'Renal', 'Gineco obstetricos', 'Quirurgicos', 'Alergias', 'Hemorragias', 'Convulsiones', 'Habitos', 'Otros'].map((label) => (
              <FormControlLabel
                key={label}
                control={<CustomCheckbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                label={label}
              />
            ))}
          </FormGroup >

        </Grid>
        <Grid item xs={12} md={6}>

          <Typography variant="h6">Antecedentes Familiares</Typography>
          <FormGroup >
            {['Corazon', 'Metabolicos', 'Cancer', 'Artritis', 'Otros'].map((label) => (
              <FormControlLabel
                key={label}
                control={<CustomCheckbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                label={label}
              />
            ))}
          </FormGroup>
          <Typography sx={{ mt: 2 }} variant="h6">Antecedentes Odontologicos</Typography>
          <FormGroup >
            {['Hemorragias', 'Infecciones', 'Ulceras', 'Reaccion a la anestesia', 'ATM Derecho', 'ATM Izquierdo', 'Bruxismo', 'Dolor Dental', 'Otros'].map((label) => (
              <FormControlLabel
                key={label}
                control={<CustomCheckbox sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />}
                label={label}
              />
            ))}
          </FormGroup>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Antecedentes Médicos</Typography>
            <TextField
              fullWidth
              defaultValue=""
              variant="outlined"
              multiline
              minRows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Antecedentes Familiares</Typography>
            <TextField
              fullWidth
              defaultValue=""
              variant="outlined"
              multiline
              minRows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Antecedentes Odontológicos</Typography>
            <TextField
              fullWidth
              defaultValue=""
              variant="outlined"
              multiline
              minRows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Actualizar Datos
            </Button>
          </Grid>

        </Grid>

      </Grid>
    </Box>
  )
}
