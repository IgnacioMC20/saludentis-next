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
            width: '100vw',
            padding: '0',
        }}>
            <nav>
                <Navbar />
            </nav>
            <SideMenu />

            <Box sx={{
                // margin: '1rem 0 0 0',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 30px',
                height: {
                    xs: 'calc(100vh - 65px)',

                    md: 'calc(100vh - 85px)',

                }
            }}>
                {children}
            </Box>
        </Box>
    )
}
