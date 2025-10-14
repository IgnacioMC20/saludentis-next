import { Button, Grid, TextField, Typography, CircularProgress, Box } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useDiagnostic, useCreateDiagnostic, useUpdateDiagnostic } from '@/hooks'
import { IDiagnostic } from '@/models/Diagnostic'
import { showToast } from '@/utils'

type FormData = {
  diagnosis: string
  prescribedMedications: string
}

const Diagnostic = () => {
  const router = useRouter()
  const { id } = router.query
  const patientId = id as string

  // Fetch existing diagnostic data
  const { data: diagnosticResponse, isLoading: isLoadingDiagnostic } = useDiagnostic(patientId)
  const createDiagnostic = useCreateDiagnostic()
  const updateDiagnostic = useUpdateDiagnostic(patientId)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      diagnosis: '',
      prescribedMedications: '',
    },
  })

  // Load existing data into form
  useEffect(() => {
    if (diagnosticResponse?.data) {
      reset({
        diagnosis: diagnosticResponse.data.diagnosis || '',
        prescribedMedications: diagnosticResponse.data.prescribedMedications || '',
      })
    }
  }, [diagnosticResponse, reset])

  const onSubmit = async (data: FormData) => {
    if (!patientId) {
      showToast('ID de paciente no encontrado', 'error')
      return
    }

    const payload: Partial<IDiagnostic> = {
      patientId: patientId as any,
      diagnosis: data.diagnosis,
      prescribedMedications: data.prescribedMedications,
    }

    try {
      let result

      // If diagnostic exists, update it; otherwise, create new
      if (diagnosticResponse?.data) {
        result = await updateDiagnostic.mutateAsync(payload)
      } else {
        result = await createDiagnostic.mutateAsync(payload as IDiagnostic)
      }

      if (result.ok) {
        showToast('Diagnóstico guardado exitosamente', 'success')
      } else {
        showToast(result.message || 'Error al guardar el diagnóstico', 'error')
      }
    } catch (err) {
      showToast('Error al guardar el diagnóstico', 'error')
    }
  }

  if (isLoadingDiagnostic) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isSubmitting = createDiagnostic.isPending || updateDiagnostic.isPending

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
            name="prescribedMedications"
            control={control}
            rules={{ maxLength: { value: 2000, message: 'Máximo 2000 caracteres' } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                error={!!errors.prescribedMedications}
                helperText={errors.prescribedMedications?.message}
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
