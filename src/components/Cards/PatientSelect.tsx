import { ArrowCircleRightOutlined, PlusOne } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Box, Button, Typography, Link, CircularProgress } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Select } from '..'
import { usePatients } from '@/hooks'

export const PatientSelect = () => {
    const router = useRouter()
    const [patientId, setPatientId] = useState<string | null>(null)

    const { data: patients, isLoading } = usePatients()

    function handlePatientSubmit(): void {
        if (patientId) {
            router.push(`/paciente/${patientId}`)
        }
    }

    const handleNewConsultation = () => {
        if (patientId) {
            router.push(`/paciente/saldo/${patientId}?nueva-cita=1`)
        }
    }

    return (
        <Card sx={{
            boxShadow: 'none',
            height: '100%',
            width: '100%'
        }}>
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'

            }}>
                <CardHeader title='Paciente' titleTypographyProps={{
                    variant: 'h4',
                    textAlign: 'center',
                    mb: 5
                }} />
                {
                    isLoading ? (
                        <CircularProgress />
                    ) :
                        patients?.data.length > 0 && patients && (<Select patients={patients.data} setPatientId={setPatientId} />)
                }
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    {
                        patients?.data.length > 0 && (
                            <Box my={4}>
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
                                {/* <Button
                                    variant='contained'
                                    color='primary'
                                    endIcon={<PlusOne />}
                                    sx={{
                                        padding: '1rem',
                                        marginX: '1rem'
                                    }}
                                    onClick={handleNewConsultation}
                                >
                                    <Typography variant='h6' color={'white'}>Cita</Typography>
                                </Button> */}

                            </Box>
                        )
                    }

                    <NextLink href={'https://calendar.google.com/calendar'} passHref legacyBehavior>
                        <Link display={'flex'} alignItems={'center'}>
                            <Typography variant='h6'>Calendario</Typography>
                        </Link>
                    </NextLink>
                </Box>
            </CardContent>
        </Card >
    )
}
