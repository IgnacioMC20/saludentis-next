import { Download } from '@mui/icons-material'
import { Box, Button, Card, Typography, Link, IconButton, Chip } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getFullName } from '../../../utils/getFullName'
import { ConsultationDetails, LoadingSpinner, Modal, NewConsultationForm, PatientBalanceModalContent, QuotationDetails, QuotationForm, Table, } from '@/components'
import { usePatient, useConsultation, useBalance, useQuotation, useQuotations } from '@/hooks'
import { IPatient } from '@/interfaces'
import { Layout } from '@/layout'
import { theme } from '@/themes'
import { formatDateToDDMMMYYYY, generateQuotationPDF, showToast } from '@/utils'

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
    const [modalType, setModalType] = useState<'consultation' | 'payment' | 'newConsultation' | 'quotation' | 'newQuotation'>('consultation')
    const [selectedConsultationId, setSelectedConsultationId] = useState<string>('')
    const [selectedQuotationId, setSelectedQuotationId] = useState<string>('')
    const [selectedItemType, setSelectedItemType] = useState<'consultation' | 'quotation'>('consultation')
    
    const handleClose = () => {
        setOpen(false)
        setModalType('consultation')
        setSelectedConsultationId('')
    }
    const router = useRouter()
    const { id } = router.query

    const { data: response, isLoading, isFetching } = usePatient(id as string)
    const {
        data: balanceResponse,
        isLoading: isBalanceLoading,
        refetch: refetchBalance
    } = useBalance(id as string)
    const {
        data: consultationResponse,
        isLoading: isConsultationLoading
    } = useConsultation(selectedConsultationId)
    const {
        data: quotationsResponse,
        refetch: refetchQuotations
    } = useQuotations(id as string)
    const {
        data: quotationResponse,
        isLoading: isQuotationLoading
    } = useQuotation(selectedQuotationId)

    const handleOpenItemModal = (id: string, type: 'consultation' | 'quotation') => {
        if (type === 'consultation') {
            setModalType('consultation')
            setSelectedConsultationId(id)
        } else {
            setModalType('quotation')
            setSelectedQuotationId(id)
        }
        setSelectedItemType(type)
        setOpen(true)
    }

    const handleOpenPaymentModal = () => {
        setModalType('payment')
        setOpen(true)
    }

    const handleOpenNewConsultationModal = () => {
        setModalType('newConsultation')
        setOpen(true)
    }

    const handleOpenQuotationModal = (id: string) => {
        setModalType('quotation')
        setSelectedQuotationId(id)
        setOpen(true)
    }

    const handleOpenNewQuotationModal = () => {
        setModalType('newQuotation')
        setOpen(true)
    }

    const handleConsultationSuccess = async () => {
        // Refetch balance data to update the table
        await refetchBalance()
        handleClose()
    }

    const handleQuotationSuccess = async () => {
        // Refetch quotations data to update the table
        await refetchQuotations()
        handleClose()
    }

    const handleExportQuotationPDF = (quotationId?: string) => {
        // If quotationId is provided, fetch that specific quotation
        const quotationToExport = quotationId
            ? quotationsResponse?.data?.find((q: any) => q._id === quotationId)
            : quotationResponse?.quotation

        if (!quotationToExport || !response?.data) {
            showToast('No hay datos de cotización para exportar', 'error')
            return
        }

        try {
            const patient = response.data as IPatient

            // Prepare treatments data
            const treatments = quotationToExport.quotationDetails?.map((detail: any) => ({
                tooth: detail.tooth || 'N/A',
                treatment: detail.treatmentId?.description || 'N/A',
                disease: detail.diseaseId?.detail || 'N/A',
                price: detail.treatmentId?.price || 0
            })) || []

            // Generate PDF
            generateQuotationPDF({
                quotation: quotationToExport,
                patient: {
                    firstName: patient.firstName || '',
                    middleName: patient.middleName,
                    lastName: patient.lastName || '',
                    nationalId: patient.nationalId || 'N/A'
                },
                treatments
            })

            showToast('PDF generado exitosamente', 'success')
        } catch (error) {
            console.error('Error generating PDF:', error)
            showToast('Error al generar el PDF', 'error')
        }
    }

    const handlePaymentSuccess = async () => {
        // Refetch balance data to update the table
        await refetchBalance()
        handleClose()
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
                    {(() => {
                        // Combine consultations and quotations
                        const consultations = balanceResponse?.balance?.balanceDetails?.map(detail => ({
                            id: detail.consultationId ? detail.consultationId.toString() : '',
                            tipo: 'Consulta',
                            fecha: formatDateToDDMMMYYYY(detail.createdAt),
                            total: detail.total || 0,
                            pagado: detail.amount || 0,
                            itemType: 'consultation' as const
                        })) || []

                        const quotations = quotationsResponse?.data?.map((quotation: any) => ({
                            id: quotation._id || '',
                            tipo: 'Cotización',
                            fecha: formatDateToDDMMMYYYY(quotation.createdAt || quotation.updatedAt),
                            total: quotation.total || 0,
                            pagado: 0,
                            itemType: 'quotation' as const,
                            quotationData: quotation
                        })) || []

                        const combinedData = [...consultations, ...quotations].sort((a, b) => {
                            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                        })

                        if (combinedData.length === 0) {
                            return (
                                <Typography variant="body1" textAlign="center" sx={{ my: 4 }}>
                                    No hay historial de citas ni cotizaciones disponible
                                </Typography>
                            )
                        }

                        return (
                            <Table
                                data={combinedData.map(item => {
                                    const baseData: any = {
                                        id: item.id,
                                        tipo: item.tipo,
                                        fecha: item.fecha,
                                        total: item.total,
                                    }

                                    // Only add 'pagado' for consultations
                                    if (item.itemType === 'consultation') {
                                        baseData.pagado = item.pagado
                                    }

                                    return baseData
                                })}
                                handleOpenConsultationModal={(id: string) => {
                                    const item = combinedData.find(i => i.id === id)
                                    if (item) {
                                        handleOpenItemModal(id, item.itemType)
                                    }
                                }}
                                customRowsPerPage={10}
                            />
                        )
                    })()}
                </Box>

                <Box marginTop={3} display={'flex'} justifyContent={'space-between'}>
                    <Box>
                        <Button sx={{
                            ...linkStyles,
                            variant: 'text',
                            size: 'medium',
                            textTransform: 'none',
                            marginRight: 2,
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
                        <Button sx={{
                            ...linkStyles,
                            variant: 'text',
                            size: 'medium',
                            textTransform: 'none',
                            marginLeft: 2,
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
                            onClick={handleOpenNewQuotationModal}>
                            <Typography variant='h6'>Nueva Cotización</Typography>
                        </Button>
                    </Box>
                    <Typography variant={'h6'} textAlign={'center'}>
                        Saldo actual: Q. {balanceResponse?.balance?.balance?.toLocaleString('es-GT') || '0'}
                    </Typography>
                </Box>
            </Card>

            <Modal open={open} handleClose={handleClose}>
                {modalType === 'consultation' && (
                    <ConsultationDetails
                        consultation={consultationResponse?.consultation}
                        isLoading={isConsultationLoading}
                    />
                )}
                {modalType === 'payment' && (
                    <PatientBalanceModalContent
                        patientId={id as string}
                        currentBalance={balanceResponse?.balance?.balance || 0}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
                {modalType === 'newConsultation' && (
                    <NewConsultationForm
                        patientId={id as string}
                        onSuccess={handleConsultationSuccess}
                    />
                )}
                {modalType === 'quotation' && (
                    <QuotationDetails
                        quotation={quotationResponse?.quotation}
                        isLoading={isQuotationLoading}
                        onExportPDF={() => handleExportQuotationPDF()}
                    />
                )}
                {modalType === 'newQuotation' && (
                    <QuotationForm
                        patientId={id as string}
                        onSuccess={handleQuotationSuccess}
                    />
                )}
            </Modal>
        </Layout >
    )
}

export default PatientBalance
