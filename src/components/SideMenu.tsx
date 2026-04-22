import {
    AssessmentOutlined,
    CalendarMonthOutlined,
    DescriptionOutlined,
    EventNoteOutlined,
    HomeRounded,
    LogoutOutlined,
    MedicalServicesOutlined,
    MonitorHeartOutlined,
    OpenInNew,
    PaidOutlined,
    PeopleAltOutlined,
    SettingsOutlined,
} from '@mui/icons-material'
import {
    alpha,
    Box,
    Button,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, useContext } from 'react'

import { AuthContext, UIContext } from '@/context'
import { theme } from '@/themes'

export const dashboardSidebarWidth = 272

type NavigationItem = {
    title: string
    icon: React.ReactNode
    href?: string
    external?: boolean
    disabled?: boolean
    matches?: string[]
}

const navigationItems: NavigationItem[] = [
    { title: 'Inicio', icon: <HomeRounded />, href: '/', matches: ['/'] },
    { title: 'Finanzas', icon: <PaidOutlined />, href: '/finanzas', matches: ['/finanzas'] },
    { title: 'Pacientes', icon: <PeopleAltOutlined />, href: '/pacientes', matches: ['/pacientes'] },
    { title: 'Consultas', icon: <EventNoteOutlined />, disabled: true },
    { title: 'Enfermedades', icon: <MonitorHeartOutlined />, href: '/enfermedades', matches: ['/enfermedades'] },
    { title: 'Tratamientos', icon: <MedicalServicesOutlined />, href: '/tratamientos', matches: ['/tratamientos'] },
    { title: 'Cotizaciones', icon: <DescriptionOutlined />, disabled: true },
    { title: 'Calendario', icon: <CalendarMonthOutlined />, href: 'https://calendar.google.com/calendar', external: true },
    { title: 'Reportes', icon: <AssessmentOutlined />, href: '/reportes', matches: ['/reportes'] },
    { title: 'Configuración', icon: <SettingsOutlined />, disabled: true },
]

const isItemActive = (pathname: string, asPath: string, item: NavigationItem) => {
    if (!item.matches) return false
    return item.matches.some(match => pathname === match || asPath === match)
}

const navItemStyles = (active: boolean) => ({
    borderRadius: '16px',
    mb: 0.5,
    minHeight: 52,
    color: active ? theme.lightSeaGreen : theme.black,
    backgroundColor: active ? alpha(theme.robinEggBlue, 0.18) : 'transparent',
    border: active ? `1px solid ${alpha(theme.lightSeaGreen, 0.2)}` : '1px solid transparent',
    '&:hover': {
        backgroundColor: active ? alpha(theme.robinEggBlue, 0.22) : alpha(theme.white, 0.72),
    },
    '& .MuiListItemIcon-root': {
        color: active ? theme.lightSeaGreen : theme.textMuted,
        minWidth: 38,
    },
    '&.Mui-disabled': {
        opacity: 0.56,
    },
})

const SidebarContent = ({
    pathname,
    asPath,
    onNavigate,
    onLogout,
}: {
    pathname: string
    asPath: string
    onNavigate: Dispatch<NavigationItem>
    onLogout: () => void
}) => {
    return (
        <Stack
            sx={{
                height: '100%',
                px: 2,
                py: 3,
                backgroundColor: alpha(theme.white, 0.8),
                backdropFilter: 'blur(18px)',
                borderRight: `1px solid ${alpha(theme.border, 0.9)}`,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 1, mb: 3 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '16px',
                        backgroundColor: alpha(theme.robinEggBlue, 0.22),
                        display: 'grid',
                        placeItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Image src="/saludentis.webp" alt="Saludentis" width={34} height={34} />
                </Box>

                <Box>
                    <Typography variant="h5" sx={{ color: theme.lightSeaGreen, lineHeight: 1 }}>
                        Saludentis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Panel operativo
                    </Typography>
                </Box>
            </Stack>

            <List sx={{ px: 0.5, flex: 1 }}>
                {navigationItems.map(item => {
                    const active = isItemActive(pathname, asPath, item)

                    return (
                        <ListItemButton
                            key={item.title}
                            disabled={item.disabled}
                            onClick={() => onNavigate(item)}
                            sx={navItemStyles(active)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.title}
                                secondary={item.disabled ? 'Próximamente' : undefined}
                                primaryTypographyProps={{
                                    fontWeight: active ? 700 : 500,
                                }}
                                secondaryTypographyProps={{
                                    fontSize: '0.74rem',
                                }}
                            />
                            {item.external ? <OpenInNew sx={{ fontSize: '0.95rem', color: theme.textMuted }} /> : null}
                        </ListItemButton>
                    )
                })}
            </List>

            <Button
                variant="outlined"
                color="primary"
                startIcon={<LogoutOutlined />}
                onClick={onLogout}
                sx={{ justifyContent: 'flex-start', mt: 2 }}
            >
                Salir
            </Button>
        </Stack>
    )
}

export const SideMenu = () => {
    const { isMenuOpen, toggleSideMenu } = useContext(UIContext)
    const { logoutUser } = useContext(AuthContext)
    const router = useRouter()

    const handleNavigate = (item: NavigationItem) => {
        if (item.disabled || !item.href) return

        if (item.external) {
            window.open(item.href, '_blank', 'noopener,noreferrer')
        } else {
            router.push(item.href)
        }

        if (isMenuOpen) toggleSideMenu()
    }

    return (
        <>
            <Box
                component="aside"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: dashboardSidebarWidth,
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1100,
                }}
            >
                <SidebarContent
                    pathname={router.pathname}
                    asPath={router.asPath}
                    onNavigate={handleNavigate}
                    onLogout={logoutUser}
                />
            </Box>

            <Drawer
                open={isMenuOpen}
                anchor="left"
                onClose={toggleSideMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: dashboardSidebarWidth,
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                }}
            >
                <SidebarContent
                    pathname={router.pathname}
                    asPath={router.asPath}
                    onNavigate={handleNavigate}
                    onLogout={logoutUser}
                />
            </Drawer>
        </>
    )
}
