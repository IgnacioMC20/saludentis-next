import { LoginOutlined, LogoutOutlined, EscalatorWarning, Vaccines, Sick, Home, OpenInNew } from '@mui/icons-material'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Link } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import { AuthContext, UIContext } from '@/context'

const pages = [
    {
        title: 'Inicio',
        icon: <Home />
    },
    {
        title: 'Pacientes',
        icon: <EscalatorWarning />
    },
    {
        title: 'Tratamientos',
        icon: <Sick />
    },
    {
        title: 'Enfermedades',
        icon: <Vaccines />
    }
]

export const SideMenu = () => {
    const { isMenuOpen, toggleSideMenu } = useContext(UIContext)
    const { logoutUser } = useContext(AuthContext)
    const isLoggedIn = true
    const router = useRouter()

    const navigateTo = (url: string) => {
        toggleSideMenu()
        router.push(url)
    }

    return (
        <Drawer
            open={isMenuOpen}
            anchor='left'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 300, paddingTop: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>

                <List sx={{ flex: 1 }}>
                    {
                        pages.map(({ title, icon }, index) => (
                            <ListItemButton key={index} onClick={() => navigateTo(title === 'Inicio' ? '/' : `/${title[0].toLowerCase()}${title.slice(1)}`)} sx={{
                                display: (router.pathname === '/' && title === 'Inicio' ? 'none' : 'flex'),
                            }}>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={title} />
                            </ListItemButton>
                        ))
                    }
                    {
                        isLoggedIn ? (
                            <ListItemButton onClick={logoutUser}>
                                <ListItemIcon>
                                    <LogoutOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                                <ListItemIcon>
                                    <LoginOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItemButton>
                        )
                    }
                </List>

                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ px: 2, pb: 2 }}>
                    <Link
                        href="https://www.antiguatechlabs.com/es"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            textDecoration: 'none',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            '&:hover': {
                                color: 'primary.main',
                            }
                        }}
                    >
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                            Powered by Antigua Tech Labs
                        </Typography>
                        <OpenInNew sx={{ fontSize: '0.875rem' }} />
                    </Link>
                </Box>
            </Box>
        </Drawer>
    )
}