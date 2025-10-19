import { Grid, TextField, Typography, Button, FormGroup, FormControlLabel, Checkbox, CircularProgress, Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useBackground, useCreateBackground, useUpdateBackground } from '@/hooks'
import { IBackground } from '@/models/Background'
import { showToast } from '@/utils'

// Checkbox options for each section
const MEDICAL_CONDITIONS = [
  'Enfermedad del corazon',
  'Metabolicos',
  'Cancer',
  'SCI',
  'Estreñimiento',
  'Gastritis',
  'Artritis',
  'Renal',
  'Gineco obstetricos',
  'Quirurgicos',
  'Alergias',
  'Hemorragias',
  'Convulsiones',
  'Habitos',
  'Otros'
]

const FAMILY_CONDITIONS = [
  'Corazon',
  'Metabolicos',
  'Cancer',
  'Artritis',
  'Otros'
]

const DENTAL_CONDITIONS = [
  'Hemorragias',
  'Infecciones',
  'Ulceras',
  'Reaccion a la anestesia',
  'ATM Derecho',
  'ATM Izquierdo',
  'Bruxismo',
  'Dolor Dental',
  'Otros'
]

type FormData = {
  medicalHistory: {
    conditions: string[]
    notes: string
  }
  familyHistory: {
    conditions: string[]
    notes: string
  }
  dentalHistory: {
    conditions: string[]
    notes: string
  }
}

export default function ClinicHistory() {
  const router = useRouter()
  const { id } = router.query
  const patientId = id as string

  // Fetch existing background data
  const { data: backgroundResponse, isLoading: isLoadingBackground } = useBackground(patientId)
  const createBackground = useCreateBackground()
  const updateBackground = useUpdateBackground(patientId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      medicalHistory: { conditions: [], notes: '' },
      familyHistory: { conditions: [], notes: '' },
      dentalHistory: { conditions: [], notes: '' },
    },
  })

  // Load existing data into form
  useEffect(() => {
    if (backgroundResponse?.data) {
      reset({
        medicalHistory: {
          conditions: backgroundResponse.data.medicalHistory?.conditions || [],
          notes: backgroundResponse.data.medicalHistory?.notes || '',
        },
        familyHistory: {
          conditions: backgroundResponse.data.familyHistory?.conditions || [],
          notes: backgroundResponse.data.familyHistory?.notes || '',
        },
        dentalHistory: {
          conditions: backgroundResponse.data.dentalHistory?.conditions || [],
          notes: backgroundResponse.data.dentalHistory?.notes || '',
        },
      })
    }
  }, [backgroundResponse, reset])

  const onSubmit = async (data: FormData) => {
    if (!patientId) {
      showToast('ID de paciente no encontrado', 'error')
      return
    }

    const payload: Partial<IBackground> = {
      patientId: patientId as any,
      medicalHistory: data.medicalHistory,
      familyHistory: data.familyHistory,
      dentalHistory: data.dentalHistory,
    }

    try {
      let result

      // If background exists, update it; otherwise, create new
      if (backgroundResponse?.data) {
        result = await updateBackground.mutateAsync(payload)
      } else {
        result = await createBackground.mutateAsync(payload as IBackground)
      }

      if (result.ok) {
        showToast('Historial clínico guardado exitosamente', 'success')
      } else {
        showToast(result.message || 'Error al guardar el historial clínico', 'error')
      }
    } catch (err) {
      showToast('Error al guardar el historial clínico', 'error')
    }
  }

  if (isLoadingBackground) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isSubmitting = createBackground.isPending || updateBackground.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} padding={0}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Antecedentes Médicos</Typography>
          <Controller
            name="medicalHistory.conditions"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {MEDICAL_CONDITIONS.map((label) => (
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

        <Grid item xs={12} md={6}>
          <Typography variant="h5">Antecedentes Familiares</Typography>
          <Controller
            name="familyHistory.conditions"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {FAMILY_CONDITIONS.map((label) => (
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

          <Typography sx={{ mt: 2 }} variant="h5">
            Antecedentes Odontologicos
          </Typography>
          <Controller
            name="dentalHistory.conditions"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {DENTAL_CONDITIONS.map((label) => (
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

        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">Antecedentes Médicos</Typography>
            <Controller
              name="medicalHistory.notes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={2}
                  error={!!errors.medicalHistory?.notes}
                  helperText={errors.medicalHistory?.notes?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5">Antecedentes Familiares</Typography>
            <Controller
              name="familyHistory.notes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={2}
                  error={!!errors.familyHistory?.notes}
                  helperText={errors.familyHistory?.notes?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5">Antecedentes Odontológicos</Typography>
            <Controller
              name="dentalHistory.notes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.dentalHistory?.notes}
                  helperText={errors.dentalHistory?.notes?.message}
                />
              )}
            />
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
                <Typography variant="h6">Guardar</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
