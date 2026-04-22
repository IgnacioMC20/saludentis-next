import { Add } from '@mui/icons-material'
import { Card, Typography, Box, TextField, Grid, Button } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { saludentisApi } from '@/api'
import { LoadingSpinner, Modal, FloatingActionButton } from '@/components'
import { Table } from '@/components/ui/Table'
import { UIContext } from '@/context'
import { dbDisease } from '@/database'
import { useDisease, useDiseases } from '@/hooks'
import { IDisease } from '@/interfaces'
import { Layout } from '@/layout'
import { showToast } from '@/utils'

export interface FormValues {
    detail: string
}

const Enfermedades = () => {
    const { isModalOpen, toggleModal } = useContext(UIContext)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { data: diseasesData, isLoading: isDiseasesLoading, refetch } = useDiseases()
    const { data: diseaseData, isLoading: isDiseaseLoading, isFetching } = useDisease(selectedId || '')

    const formattedData = diseasesData?.data?.map((disease: IDisease) => {
        return {
            id: disease._id,
            ['Descripción']: disease.detail,
            ['Editar']: disease._id,
        }
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            detail: diseaseData?.data.detail
        },
    })

    useEffect(() => {
        if (diseaseData?.data) {
            reset(diseaseData?.data)
        }
    }, [diseaseData?.data, reset])

    const fetchDisease = (id: string) => {
        setSelectedId(id)
        if (!isDiseaseLoading)
            toggleModal()
    }

    const onSubmitForm = async (diseaseData: FormValues) => {

        const url = selectedId ? `/disease/${selectedId}` : '/disease'
        const method = selectedId ? 'PUT' : 'POST'

        const response = await saludentisApi({
            url,
            method,
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
            <Box
                sx={{
                    minHeight: { xs: 'calc(100dvh - 92px)', md: 'calc(100dvh - 32px)' },
                    height: { xs: 'calc(100dvh - 92px)', md: 'calc(100dvh - 32px)' },
                    display: 'grid',
                    placeItems: 'center',
                    width: '100%',
                    py: 0,
                }}
            >
                <Card
                    sx={{
                        paddingY: { xs: 3, md: 5 },
                        paddingX: { xs: 2, md: 5 },
                        width: '100%',
                        maxWidth: '1120px',
                        mx: 'auto',
                        height: '700px',
                        minHeight: '500px',
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
                                {selectedId ? 'Editar Enfermedad' : 'Agregar Enfermedad'}
                            </Typography>

                            {isDiseasesLoading || isFetching ? (
                                <LoadingSpinner />
                            ) : (
                                <Box
                                    sx={{
                                        maxWidth: 600,
                                        width: '100%',
                                        textAlign: 'left',
                                    }}
                                >
                                    <form onSubmit={handleSubmit(onSubmitForm)} noValidate style={{ width: '100%' }}>
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
            </Box>
            <FloatingActionButton func={() => {
                setSelectedId(null)
                reset({ detail: '' })
                toggleModal()
            }} icon={<Add color='info' />} />
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
            ['Editar']: disease._id,
        }
    })

    return {
        props: {
            diseases: JSON.parse(JSON.stringify(formattedData)) || [],
        },
    }
}
