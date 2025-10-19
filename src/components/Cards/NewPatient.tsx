import { ChildCare, Face, } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'

import { usePatients } from '@/hooks'
import { getAgeGroupData } from '@/utils'

const Chart = dynamic(() => import('../Chart'), {
    ssr: false
})

export const NewPatient = () => {

    const { data: patientsData } = usePatients()
    const patientsChartData = patientsData ? getAgeGroupData(patientsData.data) : []
    return (
        <Card sx={{
            boxShadow: 'none',
            height: '100%',
            width: '100%',
            padding: 0
        }}>
            <CardHeader title='Nuevo' titleTypographyProps={{
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
                width: '100%',
            }}>
                <Grid container display={'flex'} alignItems={'center'} flexDirection={'column'} sx={{
                    height: '100%',
                    padding: 0,
                }}>
                    <Grid item width={'100%'} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Chart data={patientsChartData} />
                    </Grid>
                    <Grid mt={5} item display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} width={'100%'}>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'}>
                            <NextLink href={'/paciente/nuevo'} passHref legacyBehavior>
                                {/* <IconButton size="large" color='primary'>
                                    <ChildCare />
                                </IconButton> */}
                                <Button variant='contained' endIcon={<ChildCare />} sx={{
                                    padding: '1rem',
                                    marginX: '1rem'
                                }}>
                                    <Typography variant='h6' color={'white'}>Niño</Typography>

                                </Button>
                            </NextLink>

                            <NextLink href={'/paciente/nuevo?tipo=adulto'} passHref legacyBehavior>
                                <Button variant='contained' endIcon={<Face />} sx={{
                                    padding: '1rem',
                                    marginX: '1rem',
                                    // borderRadius: '50%'
                                }}>
                                    <Typography variant='h6' color={'white'}>Adulto</Typography>
                                </Button>
                                {/* <IconButton size="large" color='primary'>
                                    <Face3 />
                                </IconButton> */}
                            </NextLink>
                        </Box>
                    </Grid>

                </Grid>
            </CardContent>
        </Card >
    )
}
