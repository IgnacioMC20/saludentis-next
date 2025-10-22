import { Add } from '@mui/icons-material'
import { Box, Button, Card, Grid, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { saludentisApi } from '@/api'
import { FloatingActionButton, LoadingSpinner, Modal } from '@/components'
import { Table } from '@/components/ui/Table'
import { UIContext } from '@/context'
import { useTreatment, useTreatments } from '@/hooks'
import { ITreatment } from '@/interfaces'
import { Layout } from '@/layout'
import { showToast } from '@/utils'

interface FormValues {
    description: string
    price: number
}
const Tratamientos = () => {
    const { isModalOpen, toggleModal } = useContext(UIContext)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { data: treatmentsData, isLoading: isTreatmentsLoading, refetch } = useTreatments()
    const { data: treatmentData, isLoading: isTreatmentLoading, isFetching } = useTreatment(selectedId || '')

    const formattedData = treatmentsData?.data?.map((treatment: ITreatment) => {
        return {
            id: treatment._id,
            ['Descripción']: treatment.description,
            ['Precio']: treatment.price,
            ['Editar']: treatment._id,
        }
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            description: treatmentData?.data.description,
            price: treatmentData?.data.description,
        },
    })

    useEffect(() => {
        if (treatmentData?.data) {
            reset(treatmentData?.data)
        }
    }, [treatmentData?.data, reset])

    const fetchTreatment = async (id: string) => {
        setSelectedId(id)
        if (!isTreatmentLoading)
            toggleModal()
    }

    const onSubmitForm = async (treatmentData: FormValues) => {

        const url = selectedId ? `/treatment/${selectedId}` : '/treatment'
        const method = selectedId ? 'PUT' : 'POST'
        const response = await saludentisApi({
            url,
            method,
            data: treatmentData
        })

        const { ok, message } = await response.json()

        if (!ok) showToast(message, 'error')
        else {
            refetch()
            showToast(message, 'success')
        }

    }

    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 5 },
                paddingX: { xs: 2, md: 5 },
                width: {
                    xs: '100%',
                },
                height: '700px',
                minHeight: '500px',
                boxShadow: 'none',
            }}>
                <Typography variant='h4' mb={3} align='center'>Tratamientos</Typography>
                {
                    isTreatmentsLoading ?
                        <LoadingSpinner /> :
                        <Table data={formattedData} fetchFunc={fetchTreatment} />
                }
                <Modal open={isModalOpen} handleClose={toggleModal}>
                    <Grid
                        container
                        spacing={4}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ minHeight: '500px', textAlign: 'center' }}
                    >
                        <Typography variant="h4" mb={3}>
                            {selectedId ? 'Editar Tratamiento' : 'Agregar Tratamiento'}
                        </Typography>

                        {isTreatmentsLoading || isFetching ? (
                            <LoadingSpinner />
                        ) : (
                            <Box
                                sx={{
                                    maxWidth: 600,
                                    width: '100%',
                                    textAlign: 'left',
                                }}
                            >
                                <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
                                    <Grid container spacing={2}>
                                        {/* Detalles */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Detalles"
                                                variant="outlined"
                                                {...register('description', {
                                                    required: 'Este campo es requerido',
                                                })}
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                            />
                                        </Grid>
                                        {/* Precio */}
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Precio"
                                                variant="outlined"
                                                type="number"
                                                {...register('price', {
                                                    required: 'Este campo es requerido',
                                                })}
                                                error={!!errors.price}
                                                helperText={errors.price?.message}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button type="submit" variant="contained" color="primary">
                                            <Typography variant="h6">Guardar</Typography>
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        )}
                    </Grid>
                </Modal>
            </Card>
            <FloatingActionButton func={() => {
                setSelectedId(null)
                reset({ description: '', price: 0 })
                toggleModal()
            }} icon={<Add color='info' />} />
        </Layout >
    )
}

export default Tratamientos