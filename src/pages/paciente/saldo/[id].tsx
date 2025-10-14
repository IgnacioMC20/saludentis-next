import { Box, Button, Card, Typography, Link } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getFullName } from '../../../utils/getFullName'
import { ConsultationDetails, LoadingSpinner, Modal, NewConsultationForm, PatientBalanceModalContent, Table, } from '@/components'
import { usePatient, useConsultation, useConsultations, useBalance } from '@/hooks'
import { IPatient } from '@/interfaces'
import { Layout } from '@/layout'
import { theme } from '@/themes'
import { formatDateToDDMMYYYY, showToast } from '@/utils'

const linkStyles = {
    textDecoration: 'none',
    color: theme.lightSeaGreen,
    backgroundColor: 'transparent',
    '&:hover': {
        textDecoration: 'underline',
        transition: 'all 0.3s ease-in-out',
    },
}

const PatientBalance = () => {

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setModalType(null)
        setSelectedConsultationId('') // Reset the selected consultation ID
    }
    const [modalType, setModalType] = useState<'payment' | 'newConsultation' | 'consultationDetails' | null>(null)
    const [selectedConsultationId, setSelectedConsultationId] = useState<string>('')
    const router = useRouter()
    const { id } = router.query

    const { data: response, isLoading, isFetching } = usePatient(id as string)
    const {
        data: balanceResponse,
        isLoading: isBalanceLoading,
        refetch: refetchBalance
    } = useBalance(id as string)
    const {
        data: consultationsResponse,
        isLoading: isConsultationsLoading,
        refetch: refetchConsultations
    } = useConsultations(id as string)
    const {
        data: consultationResponse,
        isLoading: isConsultationLoading
    } = useConsultation(selectedConsultationId)

    console.log('=== Patient Balance Page Data ===')
    console.log('Selected Consultation ID:', selectedConsultationId)
    console.log('Consultations Response:', consultationsResponse)
    console.log('Consultations Data:', consultationsResponse?.data)
    console.log('Balance Response:', balanceResponse)
    console.log('Balance Details:', balanceResponse?.balance?.balanceDetails)
    console.log('Single Consultation Response:', consultationResponse)
    console.log('Single Consultation Data:', consultationResponse?.consultation)
    console.log('Single Consultation Details:', consultationResponse?.consultation?.consultationDetails)

    const handleOpenConsultationModal = (id: string) => {
        setModalType('consultationDetails')
        setSelectedConsultationId(id) // Set the selected consultation ID
        handleOpen()
    }

    const handleOpenPaymentModal = () => {
        setModalType('payment')
        handleOpen()
    }

    const handleOpenNewConsultationModal = () => {
        setModalType('newConsultation')
        handleOpen()
    }

    const handleConsultationSuccess = async () => {
        // Refetch both consultations and balance to get updated data
        await Promise.all([
            refetchConsultations(),
            refetchBalance()
        ])
        handleClose()
    }

    const handlePaymentSuccess = async () => {
        // Refetch both consultations and balance to get updated data
        await Promise.all([
            refetchConsultations(),
            refetchBalance()
        ])
        handleClose()
    }

    useEffect(() => {

        if (response && !response.ok) {
            showToast(response.message || 'Error al cargar el paciente', 'error')
            router.push(`/paciente/${id}`)
        }

    }, [response, router, id])

    if (isLoading || isFetching || isBalanceLoading || isConsultationsLoading || !response?.ok || !response?.data) {
        return (
            <Layout>
                <Card sx={{
                    paddingY: { xs: 3, md: 5 },
                    paddingX: { xs: 2, md: 5 },
                    width: {
                        xs: '100%',
                    },
                    minHeight: '500px',
                    maxHeight: '700px',
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'space-between',
                    flexDirection: 'column',
                }}>
                    <LoadingSpinner />
                </Card>
            </Layout>
        )
    }

    const { data } = response!
    const { firstName, middleName, lastName } = data as IPatient

    return (
        <Layout>
            <Card sx={{
                paddingY: { xs: 3, md: 5 },
                paddingX: { xs: 2, md: 5 },
                width: {
                    xs: '100%',
                },
                minHeight: '500px',
                maxHeight: '700px',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'space-between',
                flexDirection: 'column',
            }}>

                <Box>
                    <NextLink href={`/paciente/${id}`} passHref legacyBehavior>
                        <Link display={'flex'} alignItems={'center'} width={{ sm: '100%', md: '75%' }}>
                            <Typography variant={'h4'} color={'black'}>{getFullName(firstName, middleName, lastName)}</Typography>
                        </Link>
                    </NextLink>

                    <Typography variant={'h6'} my={3} align='center'>Historial de Citas</Typography>
                </Box>
                <Box sx={{
                    height: '80%',
                    overflow: 'auto'
                }}>
                    {consultationsResponse?.data && consultationsResponse.data.length > 0 ? (
                        <Table
                            data={consultationsResponse.data.map((consultation: any) => {
                                // Find the corresponding balance detail to get payment info
                                const balanceDetail = balanceResponse?.balance?.balanceDetails?.find(
                                    detail => detail.consultationId?.toString() === consultation._id?.toString()
                                )
                                return {
                                    id: consultation._id ? consultation._id.toString() : '',
                                    consulta: 'Consulta',
                                    fecha: formatDateToDDMMYYYY(consultation.consultationDetails[0]?.createdAt || ''),
                                    total: consultation.total || 0,
                                    pagado: balanceDetail?.amount || 0,
                                }
                            })}
                            handleOpenConsultationModal={handleOpenConsultationModal}
                            customRowsPerPage={5}
                        />
                    ) : (
                        <Typography variant="body1" textAlign="center" sx={{ my: 4 }}>
                            No hay historial de citas disponible
                        </Typography>
                    )}
                </Box>

                <Box marginTop={3} display={'flex'} justifyContent={'space-between'}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button sx={{
                            ...linkStyles,
                            variant: 'text',
                            size: 'medium',
                            textTransform: 'none',
                            padding: 0,
                            minWidth: 'auto',
                            boxShadow: 'none',
                            borderRadius: 0,
                            '&:hover': {
                                ...linkStyles['&:hover'],
                                color: theme.lightSeaGreen,
                                backgroundColor: 'transparent',
                            },
                        }}
                            onClick={handleOpenPaymentModal}>
                            <Typography variant='h6'>Realizar pago</Typography>
                        </Button>
                        <Button sx={{
                            ...linkStyles,
                            variant: 'text',
                            size: 'medium',
                            textTransform: 'none',
                            padding: 0,
                            minWidth: 'auto',
                            boxShadow: 'none',
                            borderRadius: 0,
                            '&:hover': {
                                ...linkStyles['&:hover'],
                                color: theme.lightSeaGreen,
                                backgroundColor: 'transparent',
                            },
                        }}
                            onClick={handleOpenNewConsultationModal}>
                            <Typography variant='h6'>Cita nueva</Typography>
                        </Button>
                    </Box>
                    <Typography variant={'h6'} textAlign={'center'}>
                        Saldo actual: Q. {balanceResponse?.balance?.balance?.toLocaleString('es-GT') || '0'}
                    </Typography>
                </Box>
            </Card>

            <Modal open={open} handleClose={handleClose}>
                {modalType === 'consultationDetails' && (
                    <ConsultationDetails
                        consultation={consultationResponse?.consultation}
                        isLoading={isConsultationLoading}
                    />
                )}
                {modalType === 'payment' && id && (
                    <PatientBalanceModalContent
                        patientId={id as string}
                        currentBalance={balanceResponse?.balance?.balance || 0}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
                {modalType === 'newConsultation' && id && (
                    <NewConsultationForm
                        patientId={id as string}
                        onSuccess={handleConsultationSuccess}
                    />
                )}
            </Modal>
        </Layout >
    )
}

export default PatientBalance
