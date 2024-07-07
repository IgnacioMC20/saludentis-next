import { Button, Card, CardContent, CardHeader, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link'

export const NewPatient = () => {
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
                <CardHeader title='Nuevo' titleTypographyProps={{
                    variant: 'h4',
                    textAlign: 'center',
                    mb: 5
                }} />
                <Grid container display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} flexDirection={'row'} sx={{
                    height: '100%',
                }}>
                    <Grid item my={1}>
                        <Button variant='contained' sx={{
                            padding: '1rem',
                            minWidth: '100px',
                        }}>
                            <NextLink href={'/nuevo/nino'} passHref legacyBehavior>
                                <Link display={'flex'} alignItems={'center'}>
                                    <Typography variant='h6' color={'white'}>Niño</Typography>
                                </Link>
                            </NextLink>
                        </Button>
                    </Grid>
                    <Grid item my={1}>
                        <Button variant='contained' sx={{
                            padding: '1rem',
                            minWidth: '100px',
                        }}>
                            <NextLink href={'/nuevo/adulto'} passHref legacyBehavior>
                                <Link display={'flex'} alignItems={'center'}>
                                    <Typography variant='h6' color={'white'}>Adulto</Typography>
                                </Link>
                            </NextLink>
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
