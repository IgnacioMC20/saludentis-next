'use client'
import { Button, Card, Grid, TextField, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
// import { getServerSession } from 'next-auth'
import { getSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

// import { authOptions } from '../api/auth/[...nextauth]'
import { AuthLayout } from '@/layout'
import { validations } from '@/utils'

type FormData = {
    email: string,
    password: string,
}

const LoginPage: NextPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const onLoginUser = async ({ email, password }: FormData) => {
        signIn('credentials', { email, password })
    }

    return (
        <AuthLayout>
            <Grid container sx={{ height: '100%' }} display='flex' justifyContent='center' alignItems='center'>
                <Grid item xs={12} display='flex' justifyContent='center' alignItems='center'>
                    <Card sx={{ width: { xs: '80%', md: '60%' }, padding: '3rem', backgroundColor: 'rgba(255,255,255)' }} >
                        <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                            <Grid container spacing={4}>
                                <Grid item xs={12} marginY={2} display='flex' flexDirection={'column'} alignItems={'center'} justifyContent='center'>
                                    <Image
                                        src="/saludentis.webp"
                                        width={150}
                                        height={150}
                                        alt="Saludentis logo"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Correo'
                                        type='email'
                                        variant='outlined'
                                        fullWidth
                                        {...register('email', {
                                            required: 'Este campo es requerido',
                                            validate: (value) => validations.isEmail(value)
                                        })}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        autoComplete='false'
                                        autoCorrect='false'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label='Contraseña'
                                        type='password'
                                        variant='outlined'
                                        fullWidth
                                        {...register('password', {
                                            required: 'Este campo es requerido',
                                            minLength: { value: 6, message: 'Minimo de 6 caracteres' }
                                        })}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        autoComplete='false'
                                        autoCorrect='false'
                                    />
                                </Grid>
                                <Grid item xs={12} marginBottom={2}>
                                    <Button type='submit' fullWidth>
                                        <Typography color='white' variant='h6'>Iniciar Sesión</Typography>
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Card>
                </Grid>
            </Grid >
        </AuthLayout >
    )
}

// eslint-disable-next-line
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const session = await getSession({ req }) ?? false
//     console.log('===', session)
//     // const { p = '/' } = query

//     if (session) {
//         return {
//             redirect: {
//                 // destination: p.toString(),
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {}
//     }
// }

export default LoginPage