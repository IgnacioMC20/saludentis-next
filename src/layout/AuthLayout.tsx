import { Box } from '@mui/material'
import { FC } from 'react'

import { background } from '@/themes'

interface Props {
    children: React.ReactNode
}

export const AuthLayout: FC<Props> = ({ children }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            padding: '0',
            backgroundImage: `url(${background.cake.src})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 400px',
        }}>
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 30px',
            }}>
                {children}
            </main>
        </Box>
    )
}
