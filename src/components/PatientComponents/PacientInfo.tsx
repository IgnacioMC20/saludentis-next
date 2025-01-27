import { Box, Grid, TextField, Button, Typography, Radio, FormControlLabel, RadioGroup, FormLabel, FormControl } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

// import { Patient } from '../../interfaces'
import PatientFormSkeleton from './PatientInfo.Skeleton'
import { saludentisApi } from '@/api'
import { usePatient } from '@/hooks'
import { getAge, showToast, validations } from '@/utils'

type PatientFormData = {
  firstName: string
  middleName: string
  lastName: string
  nationalId: string // DPI or CUI
  gender: string
  birthDate: string // Birth date in ISO format (YYYY-MM-DD)
  address: string
  email: string
  phone: string
  maritalStatus: string,
  occupation: string
  guardianName: string
  guardianPhone: string
  lastVisit: string // Last visit date in ISO format (YYYY-MM-DD)
  lastTreatment: string
  consultationReason: string
}

export default function PacientInfo() {

  const router = useRouter()
  const { id, edit } = router.query
  const isNewPatient = router.pathname.includes('nuevo')
  const isEditEnabled = edit === 'true'

  const { data: response, isLoading } = usePatient(id as string)

  const patientData = useMemo(() => {
    return response?.ok ? response.data : null
  }, [response, isLoading])

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<PatientFormData>({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      nationalId: '',
      birthDate: '',
      address: '',
      email: '',
      phone: '',
      maritalStatus: 'Soltero',
      occupation: '',
      guardianName: '',
      guardianPhone: '',
      lastVisit: '',
      lastTreatment: '',
      consultationReason: '',
    },
  })

  const guardianName = watch('guardianName')
  const birthDate = watch('birthDate')
  const [age, setAge] = useState<string | null>(getAge(birthDate))

  useEffect(() => {
    if (patientData) {
      reset(patientData)
    }
  }, [patientData, reset])

  useEffect(() => {
    setAge(getAge(birthDate))
  }, [birthDate])

  const onSubmitForm = async (patientData: PatientFormData) => {

    const response = await saludentisApi({
      url: '/patient',
      method: isEditEnabled ? 'PUT' : 'POST',
      data: patientData
    })

    const { ok, message, data } = await response.json()

    if (!ok) showToast(message, 'error')
    else {
      showToast(message, 'success')
      router.push(`/paciente/${data._id}`)
    }
  }

  return (isLoading ? <PatientFormSkeleton /> : (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nombre'
              variant='outlined'
              placeholder='Ingrese los nombres del paciente'
              {...register('firstName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          {/* Segundo Nombre */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Segundo Nombre'
              variant='outlined'
              placeholder='Ingrese el segundo nombre del paciente'
              {...register('middleName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.middleName}
              helperText={errors.middleName?.message}
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
              {...register('nationalId', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Solo se permiten números del 0 al 9',
                },
              })}
              error={!!errors.nationalId}
              helperText={errors.nationalId?.message}
            />
          </Grid>

          {/* Sexo */}
          <Grid item xs={12} sm={6}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Sexo</FormLabel>
              <RadioGroup row {...register('gender')}>
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

          {/* Edad */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Edad'
              hiddenLabel
              variant='outlined'
              value={age ?? ''}
              InputLabelProps={{ shrink: true }}
              disabled
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

          {/* Estado Civil */}
          <Grid item xs={12}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Estado Civil</FormLabel>
              <RadioGroup row {...register('maritalStatus')}>
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

          {/* Numero del Encargado */}
          {
            guardianName && guardianName.length > 0 &&
            (<Grid item xs={12}>
              {/* <FormControl component='fieldset'>
                <FormLabel component='legend'>Relación del Encargado</FormLabel>
                <RadioGroup row defaultValue='2' {...register('guardianPhone')}>
                  <FormControlLabel value='2' control={<Radio />} label='Papá' />
                  <FormControlLabel value='1' control={<Radio />} label='Mamá' />
                  <FormControlLabel value='3' control={<Radio />} label='Encargado' />
                </RadioGroup>
              </FormControl> */}
              <TextField
                fullWidth
                label='Número del Encargado'
                variant='outlined'
                placeholder='Ingrese el número de teléfono del encargado'
                {...register('guardianPhone', {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Solo se permiten números del 0 al 9',
                  }
                })}
                error={!!errors.guardianPhone}
                helperText={errors.guardianPhone?.message}
              />
            </Grid>)
          }

          {/* Última visita */}
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
              error={!!errors.lastVisit}
              helperText={errors.lastVisit?.message}
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
            <Button disabled={!isEditEnabled && !isNewPatient} variant='contained' type='submit' color='primary'>
              <Typography variant='h6'>Guardar</Typography>
            </Button>
          </Grid>
        </Grid>
      </form>

    </Box>
  )
  )
}
