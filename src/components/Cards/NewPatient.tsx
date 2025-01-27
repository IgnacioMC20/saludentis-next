import { AddCircle } from '@mui/icons-material'
import { Button, Card, CardContent, Grid, Typography } from '@mui/material'
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
            <CardContent sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                padding: 0,
            }}>
                <Grid container display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={'column'} sx={{
                    height: '100%',
                    padding: 0,
                }}>
                    <Grid item my={1} width={'100%'} display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Chart data={patientsChartData} />
                    </Grid>
                    <Grid item display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} width={'100%'}>
                        <Grid item my={1}>
                            <NextLink href={'/paciente/nuevo'} passHref legacyBehavior>
                                <Button variant='contained' endIcon={<AddCircle />}>
                                    <Typography variant='h6' color={'white'}>Niño</Typography>
                                </Button>
                            </NextLink>
                        </Grid>
                        <Grid item mt={{ xs: 3, md: 0 }} >
                            <NextLink href={'/paciente/nuevo?tipo=adulto'} passHref legacyBehavior>
                                <Button variant='contained' endIcon={<AddCircle />}>
                                    <Typography variant='h6' color={'white'}>Adulto</Typography>
                                </Button>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
