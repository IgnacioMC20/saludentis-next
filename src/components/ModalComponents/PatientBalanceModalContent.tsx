import { Box, Button, Grid, InputAdornment, OutlinedInput, Typography, CircularProgress } from '@mui/material'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useAddPayment } from '@/hooks'
import { showToast } from '@/utils'

type FormData = {
    amount: string,
}

interface PatientBalanceModalContentProps {
    patientId: string;
    currentBalance: number;
    onSuccess?: () => void;
}

export const PatientBalanceModalContent: React.FC<PatientBalanceModalContentProps> = ({
    patientId,
    currentBalance,
    onSuccess
}) => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()
    const addPayment = useAddPayment()

    const onPay = async ({ amount }: FormData) => {
        try {
            const result = await addPayment.mutateAsync({
                patientId,
                amount: Number(amount)
            })

            if (result.success) {
                showToast('Pago registrado exitosamente', 'success')
                reset()
                if (onSuccess) onSuccess()
            } else {
                showToast(result.message || 'Error al registrar el pago', 'error')
            }
        } catch (error) {
            showToast('Error al registrar el pago', 'error')
            console.error(error)
        }
    }

    useEffect(() => {
        if (errors.amount) showToast(errors.amount.message || 'Error, vuelve a intentarlo', 'error')
    }, [errors])

    return (
        <>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} marginBottom={3} flexDirection={'column'}>
                <Image src='/money.svg' alt='money' width={150} height={150} />
                <Typography variant="h5" component="h2" marginTop={3} fontSize={24} color={'gray'}>
                    Saldo: Q. {currentBalance.toLocaleString('es-GT')}
                </Typography>
            </Box>
            <form onSubmit={handleSubmit(onPay)} noValidate>
                <Grid container spacing={4}>
                    <Grid item xs={12} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                        {/* <InputLabel htmlFor="amount-to-pay">Cantidad a pagar</InputLabel> */}
                        <OutlinedInput
                            id="amount-to-pay"
                            type='number'
                            inputProps={{ min: 0 }}
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
                        <Button type='submit' disabled={addPayment.isPending}>
                            {addPayment.isPending ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <Typography color='white' variant='h6'>Guardar</Typography>
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}
