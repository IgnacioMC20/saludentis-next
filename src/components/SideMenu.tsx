import { LoginOutlined, LogoutOutlined, EscalatorWarning, Vaccines, Sick, Home } from '@mui/icons-material'
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
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
            <Box sx={{ width: 300, paddingTop: 5, height: '100%' }}>

                <List>
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
            </Box>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#68d8d6" fill-opacity="0.5" d="M0,224L8.6,229.3C17.1,235,34,245,51,213.3C68.6,181,86,107,103,90.7C120,75,137,117,154,149.3C171.4,181,189,203,206,197.3C222.9,192,240,160,257,122.7C274.3,85,291,43,309,48C325.7,53,343,107,360,138.7C377.1,171,394,181,411,197.3C428.6,213,446,235,463,218.7C480,203,497,149,514,133.3C531.4,117,549,139,566,138.7C582.9,139,600,117,617,133.3C634.3,149,651,203,669,224C685.7,245,703,235,720,218.7C737.1,203,754,181,771,186.7C788.6,192,806,224,823,213.3C840,203,857,149,874,112C891.4,75,909,53,926,58.7C942.9,64,960,96,977,101.3C994.3,107,1011,85,1029,90.7C1045.7,96,1063,128,1080,149.3C1097.1,171,1114,181,1131,197.3C1148.6,213,1166,235,1183,229.3C1200,224,1217,192,1234,165.3C1251.4,139,1269,117,1286,128C1302.9,139,1320,181,1337,165.3C1354.3,149,1371,75,1389,37.3C1405.7,0,1423,0,1431,0L1440,0L1440,320L1431.4,320C1422.9,320,1406,320,1389,320C1371.4,320,1354,320,1337,320C1320,320,1303,320,1286,320C1268.6,320,1251,320,1234,320C1217.1,320,1200,320,1183,320C1165.7,320,1149,320,1131,320C1114.3,320,1097,320,1080,320C1062.9,320,1046,320,1029,320C1011.4,320,994,320,977,320C960,320,943,320,926,320C908.6,320,891,320,874,320C857.1,320,840,320,823,320C805.7,320,789,320,771,320C754.3,320,737,320,720,320C702.9,320,686,320,669,320C651.4,320,634,320,617,320C600,320,583,320,566,320C548.6,320,531,320,514,320C497.1,320,480,320,463,320C445.7,320,429,320,411,320C394.3,320,377,320,360,320C342.9,320,326,320,309,320C291.4,320,274,320,257,320C240,320,223,320,206,320C188.6,320,171,320,154,320C137.1,320,120,320,103,320C85.7,320,69,320,51,320C34.3,320,17,320,9,320L0,320Z"></path>
            </svg>
        </Drawer>
    )
}