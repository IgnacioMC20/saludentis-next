
import { CircularProgress, Box } from '@mui/material'

import { theme } from '@/themes'

export const Loading = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1300,
        }}
            data-testid="loading-box"
        >
            <>
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={theme.celeste2} />
                            <stop offset="100%" stopColor={theme.skyBlue} />
                        </linearGradient>
                    </defs>
                </svg>
                <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
            </>
        </Box>
    )
}
