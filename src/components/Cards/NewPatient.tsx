import { AddCircle } from '@mui/icons-material'
import { Button, Card, CardContent, Grid, Link, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'

const Chart = dynamic(() => import('../Chart'), {
    ssr: false
})

const data = [
    { id: 0, value: 10, label: 'Niños' },
    { id: 1, value: 15, label: 'Adultos' },
]

export const NewPatient = () => {
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
                        <Chart data={data} />
                    </Grid>
                    <Grid item display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={{ xs: 'column', md: 'row' }} width={'100%'}>
                        <Grid item my={1}>
                            <Button variant='contained' endIcon={<AddCircle />}>
                                <NextLink href={'/nuevo/nino'} passHref legacyBehavior>
                                    <Link display={'flex'} alignItems={'center'}>
                                        <Typography variant='h6' color={'white'}>Niño</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </Grid>
                        <Grid item mt={{ xs: 3, md: 0 }} >
                            <Button variant='contained' endIcon={<AddCircle />}>
                                <NextLink href={'/nuevo/adulto'} passHref legacyBehavior>
                                    <Link display={'flex'} alignItems={'center'}>
                                        <Typography variant='h6' color={'white'}>Adulto</Typography>
                                    </Link>
                                </NextLink>
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    )
}
