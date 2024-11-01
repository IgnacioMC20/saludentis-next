import { Box, Grid, TextField, Button, Typography, Radio, FormControlLabel, RadioGroup, FormLabel, FormControl } from '@mui/material'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

// import { Patient } from '../../interfaces'
import { validations } from '@/utils'

type PatientFormData = {
  firstName: string
  lastName: string
  dpi: string // DPI or CUI
  gender: 'Male' | 'Female'
  birthDate: string // Birth date in ISO format (YYYY-MM-DD)
  address: string
  email: string
  phone: string
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Separated' | 'Partnered'
  occupation: string
  guardianName: string
  guardianRelationship: 'Father' | 'Mother' | 'Guardian'
  lastVisit: string // Last visit date in ISO format (YYYY-MM-DD)
  lastTreatment: string
  consultationReason: string
}

export default function PacientInfo() {

  const router = useRouter()
  const isNewPatient = router.pathname.includes('nuevo')
  console.log(isNewPatient)
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormData>()

  const onSubmitForm = (data: PatientFormData) => {

    console.log(data)
  }

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <Grid container spacing={2}>
          {/* Nombres */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nombres'
              variant='outlined'
              value={isNewPatient ? '' : 'Ign'}
              placeholder='Ingrese los nombres del paciente'
              {...register('firstName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>

          {/* Apellidos */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Apellidos'
              variant='outlined'
              placeholder='Ingrese los apellidos del paciente'
              {...register('lastName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          {/* CUI/DPI */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='CUI/DPI'
              variant='outlined'
              placeholder='Ingrese el CUI/DPI del paciente'
              {...register('dpi')}
            />
          </Grid>

          {/* Sexo */}
          <Grid item xs={12} sm={6}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Sexo</FormLabel>
              <RadioGroup row defaultValue='Masculino' {...register('gender')}>
                <FormControlLabel value='Masculino' control={<Radio />} label='Masculino' />
                <FormControlLabel value='Femenino' control={<Radio />} label='Femenino' />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Fecha de Nacimiento */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Fecha de Nacimiento'
              variant='outlined'
              type='date'
              InputLabelProps={{
                shrink: true,
              }}
              {...register('birthDate', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
            />
          </Grid>

          {/* Dirección */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Dirección'
              variant='outlined'
              placeholder='Ingrese la dirección del paciente'
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              placeholder='Ingrese el email del paciente'
              {...register('email', {
                validate: (value) => value === '' || validations.isEmail(value)
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          {/* Teléfono */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Teléfono'
              variant='outlined'
              placeholder='Ingrese el número de teléfono'
              type='number'
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>

          {/* Estado Civil */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Estado Civil</FormLabel>
              <RadioGroup row defaultValue='Soltero' {...register('maritalStatus')}>
                <FormControlLabel value='Soltero' control={<Radio />} label='Soltero' />
                <FormControlLabel value='Casado' control={<Radio />} label='Casado' />
                <FormControlLabel value='Divorciado' control={<Radio />} label='Divorciado' />
                <FormControlLabel value='Separado' control={<Radio />} label='Separado' />
                <FormControlLabel value='Unido' control={<Radio />} label='Unido' />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Ocupación */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Ocupación'
              variant='outlined'
              placeholder='Ingrese la ocupación'
              {...register('occupation')}
            />
          </Grid>

          {/* Nombre del Encargado */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nombre del Encargado'
              variant='outlined'
              placeholder='Ingrese el nombre del encargado'
              {...register('guardianName')}
            />
          </Grid>

          {/* Relación del Encargado */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Relación del Encargado</FormLabel>
              <RadioGroup row defaultValue='2' {...register('guardianRelationship')}>
                <FormControlLabel value='2' control={<Radio />} label='Papá' />
                <FormControlLabel value='1' control={<Radio />} label='Mamá' />
                <FormControlLabel value='3' control={<Radio />} label='Encargado' />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Última Visita */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Última visita'
              variant='outlined'
              type='date'
              InputLabelProps={{
                shrink: true,
              }}
              {...register('lastVisit')}
            />
          </Grid>

          {/* Último Tratamiento */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Último tratamiento'
              variant='outlined'
              placeholder='Ingrese el último tratamiento'
              {...register('lastTreatment')}
            />
          </Grid>

          {/* Motivo de la Consulta */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Motivo de la Consulta'
              variant='outlined'
              placeholder='Ingrese el motivo de la consulta'
              {...register('consultationReason', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.consultationReason}
              helperText={errors.consultationReason?.message}
            />
          </Grid>

          {/* Botón de Enviar */}
          <Grid item xs={12} textAlign={'center'} marginBottom={2}>
            <Button variant='contained' type='submit' color='primary'>
              <Typography variant='h6'>Guardar</Typography>
            </Button>
          </Grid>
        </Grid>
      </form>

    </Box>
  )
}
