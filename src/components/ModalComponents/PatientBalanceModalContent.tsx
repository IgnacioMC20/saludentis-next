import { Box, Button, CircularProgress, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { saludentisApi } from '@/api'
import { showToast } from '@/utils'

type FormData = {
    amount: string,
}

interface PatientBalanceModalContentProps {
    patientId: string
    currentBalance: number
    onSuccess?: () => void
}

export const PatientBalanceModalContent = ({
    patientId,
    currentBalance,
    onSuccess
}: PatientBalanceModalContentProps) => {
    const queryClient = useQueryClient()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const onPay = async ({ amount }: FormData) => {
        const paymentAmount = Number(amount)
        
        if (paymentAmount > currentBalance) {
            showToast('El monto a pagar no puede ser mayor al saldo actual', 'error')
            return
        }

        setIsSubmitting(true)
        
        try {
            const response = await saludentisApi({
                url: `/patient/balance/${patientId}`,
                method: 'POST',
                data: { amount: paymentAmount }
            })
            
            const data = await response.json()
            
            if (data.success) {
                showToast('Pago registrado exitosamente', 'success')
                
                // Invalidate balance queries to refresh the data
                queryClient.invalidateQueries({ queryKey: ['balance'] })
                
                // Call onSuccess which will handle refetching in parent
                onSuccess?.()
            } else {
                showToast(data.message || 'Error al registrar el pago', 'error')
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error)
            showToast('Error al procesar el pago', 'error')
        } finally {
            setIsSubmitting(false)
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
                        <OutlinedInput
                            id="amount-to-pay"
                            type='number'
                            inputProps={{ min: 0, max: currentBalance, step: 0.01 }}
                            startAdornment={<InputAdornment position="start">Q.</InputAdornment>}
                            error={!!errors.amount}
                            autoComplete='off'
                            disabled={isSubmitting}
                            {...register('amount', {
                                required: 'Este campo es requerido',
                                validate: (value) => {
                                    const num = Number(value)
                                    if (num <= 0) return 'La cantidad debe ser mayor a 0'
                                    if (num > currentBalance) return 'La cantidad no puede ser mayor al saldo'
                                    return true
                                }
                            })}
                        />
                    </Grid>
                    <Grid item xs={12} marginBottom={2} justifyContent={'center'} display={'flex'}>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
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
