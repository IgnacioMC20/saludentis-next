import { Box, Button, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type FormData = {
    amount: string,
}

export const PatientBalanceModalContent = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const onPay = async ({ amount }: FormData) => {
        toast(`amount ${amount}`, { type: 'success' })
    }

    return (
        <>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginBottom={3} flexDirection={'column'}>
                <Image src='/money.svg' alt='money' width={150} height={150} />
                <Typography variant="h5" component="h2" marginTop={3} fontSize={24} color={'gray'}>
                    Saldo: Q. 1500
                </Typography>
            </Box>
            <form onSubmit={handleSubmit(onPay)} noValidate>
                <Grid container spacing={4}>
                    <Grid item xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                        {/* <InputLabel htmlFor="amount-to-pay">Cantidad a pagar</InputLabel> */}
                        <OutlinedInput
                            id="amount-to-pay"
                            type='number'

                            startAdornment={<InputAdornment position="start">Q.</InputAdornment>}
                            error={!!errors.amount}
                            autoComplete='false'
                            autoCorrect='false'
                            {...register('amount', {
                                required: 'Este campo es requerido',
                                validate: (value) => Number(value) > 0 || 'La cantidad debe ser mayor a 0'
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} marginBottom={2} justifyContent={'center'} display={'flex'}>
                        <Button type='submit'>
                            <Typography color='white' variant='h6'>Guardar</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}
