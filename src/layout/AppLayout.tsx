import { Box, Link, Typography } from '@mui/material'
import Head from 'next/head'
import { FC } from 'react'

import { Navbar, SideMenu } from '@/components'
import { background } from '@/themes'

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
            background: `url(${background.default.src})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            padding: '0',
            position: 'relative',
        }}>
            <Head>
                <title>Saludentis App</title>
                <meta name='description' content='Saludentis App' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <nav>
                <Navbar />
            </nav>
            <SideMenu />

            <Box sx={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px 30px 40px 30px',
                height: {
                    xs: 'calc(100vh - 65px)',
                    md: 'calc(100vh - 85px)',
                }
            }}>
                {children}
            </Box>

            <Box
                component="footer"
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    py: 0.5,
                    px: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.7rem',
                        color: 'text.secondary',
                    }}
                >
                    Powered by{' '}
                    <Link
                        href="https://www.antiguatechlabs.com/es"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        Antigua Tech Labs
                    </Link>
                </Typography>
            </Box>
        </Box>
    )
}
