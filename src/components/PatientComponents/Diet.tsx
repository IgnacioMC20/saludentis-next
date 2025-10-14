import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useCreateDiet, useDiet, useUpdateDiet } from '@/hooks'
import { IDiet } from '@/models/Diet'
import { showToast } from '@/utils'

// Organ systems checkboxes
const ORGAN_SYSTEMS = [
  'Riñon y vegija',
  'Hígado y vesicula',
  'Pulmón e intestino grueso',
  'Brazo, estómago y páncreas',
  'Corazón, intestino delgado y sistema nervioso'
]

type FormData = {
  organSystems: string[]
  dietNotes: string
  moodNotes: string
  physicalActivityNotes: string
}

const Diet = () => {
  const router = useRouter()
  const { id } = router.query
  const patientId = id as string

  // Fetch existing diet data
  const { data: dietResponse, isLoading: isLoadingDiet } = useDiet(patientId)
  const createDiet = useCreateDiet()
  const updateDiet = useUpdateDiet(patientId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      organSystems: [],
      dietNotes: '',
      moodNotes: '',
      physicalActivityNotes: '',
    },
  })

  // Load existing data into form
  useEffect(() => {
    if (dietResponse?.data) {
      reset({
        organSystems: dietResponse.data.organSystems || [],
        dietNotes: dietResponse.data.dietNotes || '',
        moodNotes: dietResponse.data.moodNotes || '',
        physicalActivityNotes: dietResponse.data.physicalActivityNotes || '',
      })
    }
  }, [dietResponse, reset])

  const onSubmit = async (data: FormData) => {
    if (!patientId) {
      showToast('ID de paciente no encontrado', 'error')
      return
    }

    const payload: Partial<IDiet> = {
      patientId: patientId as any,
      organSystems: data.organSystems,
      dietNotes: data.dietNotes,
      moodNotes: data.moodNotes,
      physicalActivityNotes: data.physicalActivityNotes,
    }

    try {
      let result

      // If diet exists, update it; otherwise, create new
      if (dietResponse?.data) {
        result = await updateDiet.mutateAsync(payload)
      } else {
        result = await createDiet.mutateAsync(payload as IDiet)
      }

      if (result.ok) {
        showToast('Información de dieta guardada exitosamente', 'success')
      } else {
        showToast(result.message || 'Error al guardar la información de dieta', 'error')
      }
    } catch (err) {
      showToast('Error al guardar la información de dieta', 'error')
    }
  }

  if (isLoadingDiet) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isSubmitting = createDiet.isPending || updateDiet.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} height={'100%'}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Sistemas de Órganos</Typography>
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h5">Dieta</Typography>
            <Controller
              name="dietNotes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.dietNotes}
                  helperText={errors.dietNotes?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h5">Estado de Ánimo</Typography>
            <Controller
              name="moodNotes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.moodNotes}
                  helperText={errors.moodNotes?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4} paddingX={1} marginTop={2}>
            <Typography variant="h5">Actividad Física</Typography>
            <Controller
              name="physicalActivityNotes"
              control={control}
              rules={{ maxLength: { value: 1000, message: 'Máximo 1000 caracteres' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  error={!!errors.physicalActivityNotes}
                  helperText={errors.physicalActivityNotes?.message}
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
