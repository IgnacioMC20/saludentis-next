import { AddCircleOutline, ArrowCircleRightOutlined } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Box, Button, Typography, Link, CircularProgress, Grid } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Select } from '..'
import { NewConsultationForm } from '../ModalComponents'
import { Modal } from '../ui'
import { usePatients } from '@/hooks'

export const PatientSelect = () => {
    const router = useRouter()
    const [patientId, setPatientId] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState(false)

    const { data: patients, isLoading } = usePatients()

    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)

    function handlePatientSubmit(): void {
        if (patientId) {
            router.push(`/paciente/${patientId}`)
        }
    }

    const handleNewConsultation = () => {
        if (patientId) {
            handleOpenModal()
        }
    }

    const handleConsultationSuccess = () => {
        handleCloseModal()
        // Navigate to the patient's balance page after creating a consultation
        if (patientId) {
            router.push(`/paciente/saldo/${patientId}`)
        }
    }

    return (
        <>
            <Card sx={{
                boxShadow: 'none',
                height: '100%',
                width: '100%',
                padding: 0
            }}>
                <CardHeader title='Paciente' titleTypographyProps={{
                    variant: 'h4',
                    textAlign: 'center',
                    // mb: 5
                }} />
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    maxHeight: '350px',
                    width: '100%',
                }}>
                    <Grid container display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexDirection={'column'} sx={{
                        height: '100%',
                        padding: 0,
                    }}>
                        {/* <Grid item my={1} width={'100%'} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Typography variant='h4' textAlign={'center'}>Selecciona un paciente</Typography>
                    </Grid> */}
                        <Grid item width={'100%'} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} borderRadius={2} padding={1} marginBottom={{
                            xs: 0,
                            // md: 2
                        }}>

                            {
                                isLoading ? (
                                    <CircularProgress />
                                ) : patients?.data.length > 0 && patients ? (
                                    <Select patients={patients.data} setPatientId={setPatientId} />
                                ) : (
                                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={2}>
                                        <Typography variant='body1' textAlign={'center'} color={'text.secondary'}>
                                            No hay pacientes registrados
                                        </Typography>
                                        <NextLink href={'/paciente/nuevo'} passHref legacyBehavior>
                                            <Link sx={{ textDecoration: 'none' }}>
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    endIcon={<AddCircleOutline />}
                                                    sx={{ padding: '0.75rem 1.5rem' }}
                                                >
                                                    <Typography variant='h6' color={'white'}>Crear primer paciente</Typography>
                                                </Button>
                                            </Link>
                                        </NextLink>
                                    </Box>
                                )
                            }
                        </Grid>
                        <Grid item display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} width={'100%'}>
                            {/* <Box display={'flex'} flexDirection={'column'} alignItems={'center'}> */}
                            <Grid item my={{
                                xs: 0,
                                // md: 2
                            }}>

                                {
                                    patients?.data.length > 0 && (
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                endIcon={<ArrowCircleRightOutlined />}
                                                sx={{
                                                    padding: '1rem',
                                                    marginX: '1rem'
                                                }}
                                                onClick={handlePatientSubmit}
                                            >
                                                <Typography variant='h6' color={'white'}>Ingresar</Typography>
                                            </Button>
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                endIcon={<AddCircleOutline />}
                                                sx={{
                                                    padding: '1rem',
                                                    marginX: '1rem'
                                                }}
                                                onClick={handleNewConsultation}
                                            >
                                                <Typography variant='h6' color={'white'}>Cita</Typography>
                                            </Button>

                                        </Box>
                                    )
                                }
                            </Grid>
                            {/* </Box> */}
                        </Grid>
                        <Grid item  >
                            <NextLink href={'https://calendar.google.com/calendar'} passHref legacyBehavior>
                                <Link display={'flex'} alignItems={'center'}>
                                    <Typography variant='h6'>Calendario</Typography>
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Modal for new consultation */}
            <Modal open={openModal} handleClose={handleCloseModal}>
                {patientId && <NewConsultationForm patientId={patientId} onSuccess={handleConsultationSuccess} />}
            </Modal>
        </>
    )
}
