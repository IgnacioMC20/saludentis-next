import { Logout, Menu as MenuIcon } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import { AuthContext, UIContext } from '@/context'
import { theme } from '@/themes'
const pages = ['Inicio', 'Pacientes', 'Tratamientos', 'Enfermedades']

export const Navbar = () => {
  const { toggleSideMenu } = useContext(UIContext)
  const { logoutUser } = useContext(AuthContext)
  const router = useRouter()

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (

    <AppBar position={'static'} sx={{ backgroundColor: theme.lightSeaGreen, alignItems: 'center', height: { xs: '60px', md: '85px' }, display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'space-between', md: '' } }}>
          {/* Logo Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image
              src='/saludentis.webp'
              width={70}
              height={70}
              alt='Saludentis logo'
            />
          </Box>

          {/* menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={toggleSideMenu}
              color='info'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <Button key={page} variant='contained'>
                  <NextLink href={`/${page[0].toLowerCase()}${page.slice(1)}`} passHref legacyBehavior>
                    <Link display={'flex'} alignItems={'center'}>
                      <Typography variant='h6' color={'white'}>{page}</Typography>
                    </Link>
                  </NextLink>
                </Button>
              ))}
            </Menu>
          </Box>

          {/* mobile title */}
          <Box display={{ xs: 'flex', md: 'none' }}>
            <NextLink href={'/'} passHref legacyBehavior>
              <Link display={'flex'} alignItems={'center'}>
                <Typography
                  variant='h6'
                  textAlign={'center'}
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 400,
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  Saludentis
                </Typography>
              </Link>
            </NextLink>
          </Box>

          {/* links desktop */}
          <Box sx={{ justifyContent: 'end', width: { md: '100%' }, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NextLink key={page} href={page === 'Inicio' ? '/' : `/${page[0].toLowerCase()}${page.slice(1)}`} passHref legacyBehavior>
                <Button variant='contained' sx={{
                  display: (router.pathname === '/' && page === 'Inicio' ? 'none' : 'flex'),
                }}>
                  <Typography variant='h6' color={'white'}>{page}</Typography>
                </Button>
              </NextLink>
            ))}
          </Box>

          <Box marginLeft={2}>
            <IconButton
              sx={{ display: { xs: 'none', md: 'block' } }}
              size='large'
              onClick={handleOpenUserMenu}
              color='info'
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Image
                src='/saludentis.webp'
                width={50}
                height={50}
                alt='saludentis logo'
              />
            </Box>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={logoutUser}>
                <Logout sx={{ mr: 1 }} />
                <Typography textAlign='center'>Salir</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )

}
