import { ArrowCircleRightOutlined } from '@mui/icons-material'
import { Card, CardContent, CardHeader, Box, Button, Typography, Link } from '@mui/material'
import NextLink from 'next/link'

import { Select } from '..'

const patients = [
    {
        id: 1,
        name: 'Juan Perez',
    },
    {
        id: 2,
        name: 'Maria Lopez',
    },
    {
        id: 3,
        name: 'Carlos Rodriguez',
    },
]

export const PatientSelect = () => {

    function handlePatientSubmit(): void {
        throw new Error('Function not implemented.')
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
                <Select patients={patients} />
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box my={4}>
                        <Button
                            variant='contained'
                            color='primary'
                            endIcon={<ArrowCircleRightOutlined />}
                            sx={{
                                padding: '1rem'
                            }}
                            onClick={handlePatientSubmit}
                        >
                            <Typography variant='h6' color={'white'}>Ingresar</Typography>
                        </Button>
                    </Box>
                    <NextLink href={'https://calendar.google.com/calendar'} passHref legacyBehavior>
                        <Link display={'flex'} alignItems={'center'}>
                            <Typography variant='h6'>Calendario</Typography>
                        </Link>
                    </NextLink>
                </Box>
            </CardContent>
        </Card>
    )
}
