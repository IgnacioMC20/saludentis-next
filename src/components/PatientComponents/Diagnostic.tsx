import { Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { usePatient, useUpdatePatient } from '@/hooks'
import { showToast } from '@/utils'

type FormData = {
  diagnosis: string
  medications: string
  annotations: string
}

const Diagnostic = () => {
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
      diagnosis: '',
      medications: '',
      annotations: '',
    },
  })

  // Load existing data into form
  useEffect(() => {
    if (patientResponse?.data) {
      reset({
        diagnosis: patientResponse.data.diagnosis || '',
        medications: patientResponse.data.medications || '',
        annotations: patientResponse.data.annotations || '',
      })
    }
  }, [patientResponse, reset])

  const onSubmit = async (data: FormData) => {
    if (!patientId) {
      showToast('ID de paciente no encontrado', 'error')
      return
    }

    try {
      const result = await updatePatient.mutateAsync({
        _id: patientId,
        diagnosis: data.diagnosis,
        medications: data.medications,
        annotations: data.annotations,
      })

      if (result.ok) {
        showToast('Diagnóstico guardado exitosamente', 'success')
      } else {
        showToast(result.message || 'Error al guardar el diagnóstico', 'error')
      }
    } catch (err) {
      showToast('Error al guardar el diagnóstico', 'error')
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
      <Grid container>
        <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
          <Typography variant="h6">Diagnóstico</Typography>
          <Controller
            name="diagnosis"
            control={control}
            rules={{ maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                error={!!errors.diagnosis}
                helperText={errors.diagnosis?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} paddingX={1} marginTop={2}>
          <Typography variant="h6">Medicamentos Recetados</Typography>
          <Controller
            name="medications"
            control={control}
            rules={{ maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                error={!!errors.medications}
                helperText={errors.medications?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} paddingX={1} marginTop={2}>
          <Typography variant="h6">Anotaciones</Typography>
          <Controller
            name="annotations"
            control={control}
            rules={{ maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                error={!!errors.annotations}
                helperText={errors.annotations?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} textAlign={'center'} marginTop={3}>
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

export default Diagnostic
