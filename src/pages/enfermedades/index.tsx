import { Card, Typography, Box, TextField, Grid, Button } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { saludentisApi } from '@/api'
import { LoadingSpinner, Modal } from '@/components'
import { Table } from '@/components/ui/Table'
import { UIContext } from '@/context'
import { dbDisease } from '@/database'
import { useDisease, useDiseases } from '@/hooks'
import { IDisease } from '@/interfaces'
import { Layout } from '@/layout'
import { showToast } from '@/utils'

interface FormValues {
    detail: string
}

const Enfermedades = () => {
    const { isModalOpen, toggleModal } = useContext(UIContext)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { data: diseasesData, isLoading: isDiseasesLoading, refetch } = useDiseases()

    const formattedData = diseasesData?.data?.map((disease: IDisease) => {
        return {
            id: disease._id,
            ['Descripción']: disease.detail,
        }
    })

    const { data: diseaseData, isLoading: isDiseaseLoading } = useDisease(selectedId || '')
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            detail: diseaseData?.data.detail,
        },
    })

    useEffect(() => {
        if (diseaseData?.data) {
            console.log('resetting form with data:', diseaseData?.data)
            reset(diseaseData?.data)
        }
    }, [diseaseData?.data, reset])

    const fetchDisease = (id: string) => {
        console.log('fetchDisease called with ID:', id)
        setSelectedId(id)
        if (!isDiseaseLoading)
            toggleModal()
    }

    const onSubmitForm = async (diseaseData: FormValues) => {

        const response = await saludentisApi({
            url: '/disease/' + selectedId,
            method: 'PUT',
            data: diseaseData
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
            <Card
                sx={{
                    paddingY: { xs: 3, md: 5 },
                    paddingX: { xs: 2, md: 5 },
                    width: { xs: '100%' },
                    minHeight: '500px',
                    boxShadow: 'none',
                }}
            >
                <Typography variant="h4" mb={3} align="center">
                    Enfermedades
                </Typography>
                {
                    isDiseasesLoading ?
                        <LoadingSpinner /> :
                        <Table data={formattedData} fetchFunc={fetchDisease} />
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
                            Editar Enfermedad
                        </Typography>

                        {isDiseasesLoading ? (
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
                                                {...register('detail', {
                                                    required: 'Este campo es requerido',
                                                })}
                                                error={!!errors.detail}
                                                helperText={errors.detail?.message}
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
        </Layout>
    )
}

export default Enfermedades

export const getServerSideProps: GetServerSideProps = async () => {
    const diseases = await dbDisease.getDiseases() as IDisease[]

    const formattedData = diseases?.map((disease: IDisease) => {
        return {
            id: disease._id,
            ['Descripción']: disease.detail,
        }
    })

    return {
        props: {
            diseases: JSON.parse(JSON.stringify(formattedData)) || [],
        },
    }
}
