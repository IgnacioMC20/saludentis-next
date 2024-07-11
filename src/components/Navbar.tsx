import { Logout, Menu as MenuIcon } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useContext, useState } from 'react'

import { AuthContext, UIContext } from '@/context'
const pages = ['Tratamientos', 'Enfermedades', 'Pacientes']
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export const Navbar = () => {
  const { toggleSideMenu } = useContext(UIContext)
  const { logoutUser } = useContext(AuthContext)

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

    <AppBar position="static" sx={{ backgroundColor: 'rgb(11, 192, 192)', alignItems: 'center', height: { md: '85px' }, display: 'flex', justifyContent: 'center' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ width: '100%', display: 'flex', justifyContent: { xs: 'space-between', md: '' } }}>
          {/* title desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Image
              src="/saludentis.webp"
              width={70}
              height={70}
              alt="Saludentis logo"
            />
            <Typography
              variant="h6"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                color: 'white',
              }}
            >
              {/* Saludentis */}
            </Typography>
          </Box>
          {/* menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleSideMenu}
              color='info'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
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
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* mobile title */}
          <Box display={{ xs: 'flex', md: 'none' }}>
            <Typography
              variant="h6"
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
          </Box>
          {/* links desktop */}
          <Box sx={{ justifyContent: 'end', width: { md: '100%' }, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                color={'primary'}
                sx={{
                  padding: '1rem',
                }}
              >
                <Typography
                  variant='h6'
                >
                  {page}
                </Typography>
              </Button>
            ))}
          </Box>
          <Box marginLeft={2}>
            <IconButton
              sx={{ display: { xs: 'none', md: 'block' } }}
              size="large"
              onClick={handleOpenUserMenu}
              color='info'
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <Image
                src="/saludentis.webp"
                width={50}
                height={50}
                alt="saludentis logo"
              />
            </Box>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
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
                <Typography textAlign="center">Salir</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )

}
