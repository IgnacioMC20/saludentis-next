import { Add, Delete } from '@mui/icons-material'
import { Box, Button, Grid, Typography, FormControl, InputLabel, MenuItem, Select as MuiSelect, TextField, InputAdornment, CircularProgress, Chip, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

import { useCreateConsultation, useDiseases, useTreatments } from '@/hooks'
import { IConsultation, IConsultationDetail } from '@/models/Consultation'
import { showToast } from '@/utils'

interface NewConsultationFormProps {
    patientId: string;
    onSuccess?: () => void;
}

type FormData = {
    consultationDetails: {
        tooth: string;
        treatmentId: string;
        diseaseId: string;
    }[];
    total: string;
}

export const NewConsultationForm: React.FC<NewConsultationFormProps> = ({ patientId, onSuccess }) => {
    const { data: treatmentsResponse, isLoading: isLoadingTreatments } = useTreatments()
    const { data: diseasesResponse, isLoading: isLoadingDiseases } = useDiseases()
    const createConsultation = useCreateConsultation()

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        defaultValues: {
            consultationDetails: [{ tooth: '', treatmentId: '', diseaseId: '' }],
            total: '0'
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'consultationDetails'
    })

    // Watch all consultation details to calculate total
    const watchConsultationDetails = watch('consultationDetails')

    // Calculate total based on selected treatments
    useEffect(() => {
        if (treatmentsResponse?.data && watchConsultationDetails) {
            let calculatedTotal = 0

            watchConsultationDetails.forEach(detail => {
                if (detail.treatmentId) {
                    const treatment = treatmentsResponse.data.find((t: any) => t._id === detail.treatmentId)
                    if (treatment && treatment.price) {
                        calculatedTotal += treatment.price
                    }
                }
            })

            setValue('total', calculatedTotal.toString())
        }
    }, [watchConsultationDetails, treatmentsResponse, setValue])

    const onSubmit = async (data: FormData) => {
        try {
            // Format the data for the API
            const consultationData: IConsultation = {
                patientId: patientId as any,
                total: Number(data.total),
                consultationDetails: data.consultationDetails.map(detail => ({
                    tooth: detail.tooth,
                    treatmentId: detail.treatmentId as any,
                    diseaseId: detail.diseaseId as any
                }))
            }

            // Create the consultation
            const result = await createConsultation.mutateAsync(consultationData)

            if (result.ok) {
                showToast('Consulta creada exitosamente', 'success')
                if (onSuccess) onSuccess()
            } else {
                showToast(result.message || 'Error al crear la consulta', 'error')
            }
        } catch (error) {
            showToast('Error al crear la consulta', 'error')
            console.error(error)
        }
    }

    if (isLoadingTreatments || isLoadingDiseases) {
        return (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{
            p: 2,
            maxHeight: { xs: '80vh', sm: '70vh' },
            overflow: 'auto'
        }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
                Nueva Consulta
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    {/* Treatment Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Detalles del Tratamiento
                        </Typography>

                        {fields.map((field, index) => (
                            <Box key={field.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Controller
                                            name={`consultationDetails.${index}.tooth`}
                                            control={control}
                                            rules={{ required: 'Requerido' }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Diente"
                                                    fullWidth
                                                    error={!!errors.consultationDetails?.[index]?.tooth}
                                                    helperText={errors.consultationDetails?.[index]?.tooth?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <Controller
                                            name={`consultationDetails.${index}.treatmentId`}
                                            control={control}
                                            rules={{ required: 'Requerido' }}
                                            render={({ field }) => (
                                                <FormControl fullWidth error={!!errors.consultationDetails?.[index]?.treatmentId}>
                                                    <InputLabel>Tratamiento</InputLabel>
                                                    <MuiSelect
                                                        {...field}
                                                        label="Tratamiento"
                                                    >
                                                        {treatmentsResponse?.data?.map((treatment: any) => (
                                                            <MenuItem key={treatment._id} value={treatment._id}>
                                                                {treatment.name} - Q.{treatment.price}
                                                            </MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={4}>
                                        <Controller
                                            name={`consultationDetails.${index}.diseaseId`}
                                            control={control}
                                            rules={{ required: 'Requerido' }}
                                            render={({ field }) => (
                                                <FormControl fullWidth error={!!errors.consultationDetails?.[index]?.diseaseId}>
                                                    <InputLabel>Enfermedad</InputLabel>
                                                    <MuiSelect
                                                        {...field}
                                                        label="Enfermedad"
                                                    >
                                                        {diseasesResponse?.data?.map((disease: any) => (
                                                            <MenuItem key={disease._id} value={disease._id}>
                                                                {disease.name}
                                                            </MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                                        {index > 0 && (
                                            <IconButton
                                                color="error"
                                                onClick={() => remove(index)}
                                                aria-label="Eliminar tratamiento"
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

                    {/* Total */}
                    <Grid item xs={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            mt: 2,
                            gap: 2
                        }}>
                            <Typography variant="h6" sx={{ mb: { xs: 1, sm: 0 } }}>Total:</Typography>
                            <Controller
                                name="total"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">Q.</InputAdornment>,
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                        sx={{ width: { xs: '100%', sm: '150px' } }}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={createConsultation.isPending}
                            sx={{ minWidth: '200px' }}
                        >
                            {createConsultation.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Typography color="white" variant="h6">Crear Consulta</Typography>
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}
