import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { usePatient, useUpdatePatient } from '@/hooks'
import { showToast } from '@/utils'

const ORGAN_SYSTEMS = [
  'Riñon y vegija',
  'Hígado y vesicula',
  'Pulmón e intestino grueso',
  'Brazo, estómago y páncreas',
  'Corazón, intestino delgado y sistema nervioso'
]

type FormData = {
  organSystems: string[]
  diet: string
  emotionalState: string
  physicalActivity: string
}

const Diet = () => {
  const router = useRouter()
  const { id } = router.query
  const patientId = id as string

  // Fetch patient data
  const { data: patientResponse, isLoading: isLoadingPatient } = usePatient(patientId)
  const updatePatient = useUpdatePatient(patientId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      organSystems: [],
      diet: '',
      emotionalState: '',
      physicalActivity: '',
    },
  })

  // Load existing data into form
  useEffect(() => {
    if (patientResponse?.data) {
      reset({
        organSystems: patientResponse.data.organSystems || [],
        diet: patientResponse.data.diet || '',
        emotionalState: patientResponse.data.emotionalState || '',
        physicalActivity: patientResponse.data.physicalActivity || '',
      })
    }
  }, [patientResponse, reset])

  const onSubmit = async (data: FormData) => {
    if (!patientId || !patientResponse?.data?.nationalId) {
      showToast('ID de paciente no encontrado', 'error')
      return
    }

    try {
      const result = await updatePatient.mutateAsync({
        nationalId: patientResponse.data.nationalId,
        organSystems: data.organSystems,
        diet: data.diet,
        emotionalState: data.emotionalState,
        physicalActivity: data.physicalActivity,
      })

      if (result.ok) {
        showToast('Información guardada exitosamente', 'success')
      } else {
        showToast(result.message || 'Error al guardar la información', 'error')
      }
    } catch (err) {
      showToast('Error al guardar la información', 'error')
    }
  }

  if (isLoadingPatient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isSubmitting = updatePatient.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} height={'100%'}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>Sistemas de Órganos</Typography>
          <Controller
            name="organSystems"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {ORGAN_SYSTEMS.map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 24 }, padding: '4px' }}
                        checked={field.value.includes(label)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, label]
                            : field.value.filter((item) => item !== label)
                          field.onChange(newValue)
                        }}
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} textAlign={'center'} marginTop={2} padding={0}>
          <Box
            overflow={{
              xs: 'auto',
              sm: ''
            }}
          >
            <Image priority src="/odontologia_neurofocal.png" alt="odontologia_neurofocal" width={400} height={230} />
          </Box>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h6">Dieta</Typography>
            <Controller
              name="diet"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.diet}
                  helperText={errors.diet?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h6">Estado de Ánimo</Typography>
            <Controller
              name="emotionalState"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.emotionalState}
                  helperText={errors.emotionalState?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h6">Actividad Física</Typography>
            <Controller
              name="physicalActivity"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.physicalActivity}
                  helperText={errors.physicalActivity?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} textAlign={'center'}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant='h6'>Guardar</Typography>
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default Diet
