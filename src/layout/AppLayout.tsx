import { Box } from '@mui/material'
import React, { FC } from 'react'

import { Navbar, SideMenu } from '@/components'

interface Props {
    children: React.ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'scroll',
            marginBottom: { xs: '2rem', md: '0' },
        }}>
            <nav style={{
                marginBottom: '2rem',
            }}>
                <Navbar />
            </nav>
            <SideMenu />

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 30px',
                height: '100%'
            }}>
                {children}
            </main>
        </Box>
    )
}
