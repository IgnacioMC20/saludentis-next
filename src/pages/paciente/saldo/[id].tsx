import { Box, Button, Card, Typography, Link } from '@mui/material'
import NextLink from 'next/link'
import { useState } from 'react'

import { Modal, PatientBalanceModalContent, Table, } from '@/components'
import { Layout } from '@/layout'
import { theme } from '@/themes'

const linkStyles = {
    textDecoration: 'none',
    color: theme.lightSeaGreen,
    backgroundColor: 'transparent',
    '&:hover': {
        textDecoration: 'underline',
        transition: 'all 0.3s ease-in-out',
    },
}

const data = [
    {
        id: '1',
        consulta: 'Consulta 1',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '2',
        consulta: 'Consulta 2',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '3',
        consulta: 'Consulta 3',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '4',
        consulta: 'Consulta 4',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '5',
        consulta: 'Consulta 5',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '6',
        consulta: 'Consulta 6',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '7',
        consulta: 'Consulta 7',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '8',
        consulta: 'Consulta 8',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '9',
        consulta: 'Consulta 9',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '10',
        consulta: 'Consulta 10',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '11',
        consulta: 'Consulta 11',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '12',
        consulta: 'Consulta 12',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '13',
        consulta: 'Consulta 13',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '14',
        consulta: 'Consulta 14',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    },
    {
        id: '15',
        consulta: 'Consulta 15',
        fecha: '2021-10-10',
        total: 100,
        pagado: 50,
    }
]

const PatientBalance = () => {

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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
                    <NextLink href={'/'} passHref legacyBehavior>
                        <Link display={'flex'} alignItems={'center'} width={{ sm: '100%', md: '75%' }}>
                            <Typography variant={'h4'} color={'black'}>Adrian Bachicha Adrian Bachicha</Typography>
                        </Link>
                    </NextLink>

                    <Typography variant={'h6'} my={3} align='center'>Historial de pagos</Typography>
                </Box>
                <Box sx={{
                    height: '80%',
                    overflow: 'auto'
                }}>
                    <Table data={data} customRowsPerPage={5} />
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

                    {/* </Link> */}
                    {/* </NextLink> */}
                    <Typography variant={'h6'} textAlign={'center'}>Saldo actual: Q. 1500</Typography>
                </Box>
            </Card>
            <Modal open={open} handleClose={handleClose}>
                <PatientBalanceModalContent />
            </Modal>
        </Layout >
    )
}

export default PatientBalance