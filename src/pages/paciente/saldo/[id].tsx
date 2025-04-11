import { Box, Button, Card, Typography, Link } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getFullName } from '../../../utils/getFullName'
import { ConsultationDetails, LoadingSpinner, Modal, PatientBalanceModalContent, Table, } from '@/components'
import { usePatient, useConsultation, useBalance } from '@/hooks'
import { IPatient } from '@/interfaces'
import { Layout } from '@/layout'
import { theme } from '@/themes'
import { showToast } from '@/utils'

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
        setIsConsultationNotPayment(false)
        setSelectedConsultationId('') // Reset the selected consultation ID
    }
    const [isConsultationNotPayment, setIsConsultationNotPayment] = useState(false)
    const [selectedConsultationId, setSelectedConsultationId] = useState<string>('')
    const router = useRouter()
    const { id } = router.query

    const { data: response, isLoading, isFetching } = usePatient(id as string)
    const {
        data: balanceResponse,
        isLoading: isBalanceLoading
    } = useBalance(id as string)
    const {
        data: consultationResponse,
        isLoading: isConsultationLoading
    } = useConsultation(selectedConsultationId)

    const handleOpenConsultationModal = (id: string) => {
        setIsConsultationNotPayment(true)
        setSelectedConsultationId(id) // Set the selected consultation ID
        handleOpen()
    }

    useEffect(() => {

        if (response && !response.ok) {
            showToast(response.message || 'Error al cargar el paciente', 'error')
            router.push(`/paciente/${id}`)
        }

    }, [response, router, id])

    if (isLoading || isFetching || isBalanceLoading || !response?.ok || !response?.data) {
        return (
            <Layout>
                <LoadingSpinner />
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

                    <Typography variant={'h6'} my={3} align='center'>Historial de pagos</Typography>
                </Box>
                <Box sx={{
                    height: '80%',
                    overflow: 'auto'
                }}>
                    {balanceResponse?.balance?.balanceDetails && balanceResponse.balance.balanceDetails.length > 0 ? (
                        <Table
                            data={balanceResponse.balance.balanceDetails.map(detail => ({
                                id: detail.consultationId ? detail.consultationId.toString() : '',
                                consulta: 'Consulta',
                                fecha: detail.createdAt ? new Date(detail.createdAt).toISOString().split('T')[0] : '',
                                total: detail.total || 0,
                                pagado: detail.amount || 0,
                            }))}
                            handleOpenConsultationModal={handleOpenConsultationModal}
                            customRowsPerPage={5}
                        />
                    ) : (
                        <Typography variant="body1" textAlign="center" sx={{ my: 4 }}>
                            No hay historial de pagos disponible
                        </Typography>
                    )}
                </Box>

                <Box marginTop={3} display={'flex'} justifyContent={'space-between'}>
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
                        onClick={handleOpen}>
                        <Typography variant='h6'>Realizar pago</Typography>
                    </Button>
                    <Typography variant={'h6'} textAlign={'center'}>
                        Saldo actual: Q. {balanceResponse?.balance?.balance?.toLocaleString('es-GT') || '0'}
                    </Typography>
                </Box>
            </Card>

            <Modal open={open} handleClose={handleClose}>
                {
                    isConsultationNotPayment ?
                        <ConsultationDetails
                            consultation={consultationResponse?.consultation}
                            isLoading={isConsultationLoading}
                        />
                        :
                        <PatientBalanceModalContent />
                }
            </Modal>
        </Layout >
    )
}

export default PatientBalance
