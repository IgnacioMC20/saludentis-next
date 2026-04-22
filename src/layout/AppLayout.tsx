import { Box } from '@mui/material'
import Head from 'next/head'
import { FC } from 'react'

import { Navbar, SideMenu } from '@/components'
import { dashboardSidebarWidth } from '@/components/SideMenu'
import { background, theme } from '@/themes'

interface Props {
    children: React.ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Saludentis Dashboard</title>
                <meta name='description' content='Panel operativo y financiero de Saludentis' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>

            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    backgroundColor: theme.background,
                    backgroundImage: `
                        radial-gradient(circle at top right, rgba(102, 224, 230, 0.18), transparent 28%),
                        radial-gradient(circle at bottom left, rgba(126, 92, 194, 0.08), transparent 24%),
                        url(${background.default.src})
                    `,
                    backgroundRepeat: 'no-repeat, no-repeat, repeat',
                    backgroundPosition: 'top right, bottom left, center',
                    backgroundSize: 'auto, auto, 280px 280px',
                }}
            >
                <SideMenu />
                <Navbar />

                <Box
                    component="main"
                    sx={{
                        minHeight: '100vh',
                        ml: { md: `${dashboardSidebarWidth}px` },
                        width: { md: `calc(100% - ${dashboardSidebarWidth}px)` },
                        pt: { xs: '68px', md: 0 },
                        px: { xs: 1.5, sm: 2.5, md: 3.5, lg: 4 },
                        pb: 0,
                        boxSizing: 'border-box',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </>
    )
}
