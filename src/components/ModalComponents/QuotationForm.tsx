// src/components/ModalComponents/QuotationForm.tsx
import { Add, Delete, Check } from '@mui/icons-material'
import {
  Box,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material'
import React, { useMemo } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'

import { useCreateQuotation, useDiseases, useTreatments } from '@/hooks'
import { IQuotation } from '@/models/Quotation'
import { showToast } from '@/utils'

interface QuotationFormProps {
  patientId: string
  onSuccess?: () => void
}

type QuotationDetailForm = {
  tooth: string
  treatmentId: string
  diseaseId: string
}

type FormData = {
  quotationDetails: QuotationDetailForm[]
  annotations: string
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
  patientId,
  onSuccess,
}) => {
  const { data: treatmentsResponse, isLoading: isLoadingTreatments } = useTreatments()
  const { data: diseasesResponse, isLoading: isLoadingDiseases } = useDiseases()
  const treatments = treatmentsResponse?.data ?? []
  const diseases = diseasesResponse?.data ?? []

  const createQuotation = useCreateQuotation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      quotationDetails: [{ tooth: '', treatmentId: '', diseaseId: '' }],
      annotations: '',
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'quotationDetails',
  })

  // Efficient watch of just the array field
  const details = useWatch({ control, name: 'quotationDetails' }) ?? []

  const treatmentsById = useMemo(() => {
    const map = new Map<string, any>()
    for (const t of treatments) map.set(t._id, t)
    return map
  }, [treatments])

  const computedTotal = useMemo(() => {
    let total = 0
    for (const d of details) {
      const t = d?.treatmentId ? treatmentsById.get(d.treatmentId) : undefined
      if (t && typeof t.price === 'number') total += t.price
    }
    return total
  }, [details, treatmentsById])

  const isRowValid = (index: number) => {
    const r = details[index] || {}
    return !!(r.tooth && r.treatmentId && r.diseaseId)
  }

  const confirmRow = async (index: number) => {
    // Ensures validation UI shows and avoids "phantom" totals
    const ok = await trigger([
      `quotationDetails.${index}.tooth`,
      `quotationDetails.${index}.treatmentId`,
      `quotationDetails.${index}.diseaseId`,
    ] as const)
    showToast(
      ok ? 'Tratamiento confirmado' : 'Por favor complete todos los campos de este tratamiento',
      ok ? 'success' : 'warning'
    )
  }

  const onSubmit = async (data: FormData) => {
    // Guardrails against partial/empty rows
    const validDetails = (data.quotationDetails ?? []).filter(
      (d) => d.tooth && d.treatmentId && d.diseaseId
    )

    if (validDetails.length === 0) {
      showToast('Debe agregar al menos un tratamiento válido', 'warning')
      return
    }

    const payload: IQuotation = {
      patientId: patientId as any,
      total: Number(computedTotal || 0), // compute at source of truth
      annotations: data.annotations || '',
      quotationDetails: validDetails.map((d) => ({
        tooth: d.tooth,
        treatmentId: d.treatmentId as any,
        diseaseId: d.diseaseId as any,
      })),
    }

    console.log('Payload being sent:', JSON.stringify(payload, null, 2))
    console.log('Valid details:', validDetails)

    try {
      const result = await createQuotation.mutateAsync(payload)
      if (result.ok) {
        showToast('Cotización creada exitosamente', 'success')
        // Call onSuccess which will handle refetching in parent
        onSuccess?.()
      } else {
        showToast(result.message || 'Error al crear la cotización', 'error')
      }
    } catch (err) {
      showToast('Error al crear la cotización', 'error')
      // Why: retain console for operational diagnostics
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  if (isLoadingTreatments || isLoadingDiseases) {
    return (
      <Box
        sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, maxHeight: { xs: '80vh', sm: '70vh' }, overflow: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Nueva Cotización
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3}>
                    <Controller
                      name={`quotationDetails.${index}.tooth`}
                      control={control}
                      rules={{ required: 'Requerido' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Diente"
                          fullWidth
                          error={!!errors.quotationDetails?.[index]?.tooth}
                          helperText={errors.quotationDetails?.[index]?.tooth?.message}
                          autoComplete="off"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name={`quotationDetails.${index}.treatmentId`}
                      control={control}
                      rules={{ required: 'Requerido' }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.quotationDetails?.[index]?.treatmentId}
                        >
                          <InputLabel shrink>Tratamiento</InputLabel>
                          <MuiSelect {...field} label="Tratamiento" displayEmpty>
                            <MenuItem value="" disabled>
                              Seleccione tratamiento
                            </MenuItem>
                            {treatments.map((t: any) => (
                              <MenuItem key={t._id} value={t._id}>
                                {t.description} - Q.{t.price}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Controller
                      name={`quotationDetails.${index}.diseaseId`}
                      control={control}
                      rules={{ required: 'Requerido' }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.quotationDetails?.[index]?.diseaseId}
                        >
                          <InputLabel shrink>Enfermedad</InputLabel>
                          <MuiSelect {...field} label="Enfermedad" displayEmpty>
                            <MenuItem value="" disabled>
                              Seleccione enfermedad
                            </MenuItem>
                            {diseases.map((d: any) => (
                              <MenuItem key={d._id} value={d._id}>
                                {d.detail}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={1}
                    sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 1 }}
                  >
                    <IconButton
                      color={isRowValid(index) ? 'success' : 'default'}
                      onClick={() => confirmRow(index)}
                      aria-label="Confirmar tratamiento"
                      size="small"
                    >
                      <Check />
                    </IconButton>

                    {fields.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        aria-label="Eliminar tratamiento"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                startIcon={<Add />}
                onClick={() => append({ tooth: '', treatmentId: '', diseaseId: '' })}
                variant="outlined"
              >
                Agregar Tratamiento
              </Button>
            </Box>
          </Grid>

          {/* Annotations */}
          <Grid item xs={12}>
            <Controller
              name="annotations"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Anotaciones"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Agregue cualquier nota o comentario adicional sobre esta cotización..."
                  autoComplete="off"
                />
              )}
            />
          </Grid>

          {/* Total */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mt: 2,
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>
                Total:
              </Typography>

              <TextField
                value={computedTotal.toFixed(2)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Q.</InputAdornment>,
                  readOnly: true,
                }}
                variant="outlined"
                sx={{ width: { xs: '100%', sm: '150px' } }}
                aria-label="Total de la cotización"
              />
            </Box>
          </Grid>

          {/* Submit */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createQuotation.isPending}
              sx={{ minWidth: '200px' }}
            >
              {createQuotation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Typography color="white" variant="h6">
                  Crear Cotización
                </Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}