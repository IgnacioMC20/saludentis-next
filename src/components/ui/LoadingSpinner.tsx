import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export const LoadingSpinner = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            <CircularProgress />
        </Box>
    )
}
