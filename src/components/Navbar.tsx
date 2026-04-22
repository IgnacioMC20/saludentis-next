import { MenuRounded } from '@mui/icons-material'
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useContext } from 'react'

import { UIContext } from '@/context'
import { theme } from '@/themes'

export const Navbar = () => {
  const { toggleSideMenu } = useContext(UIContext)

  return (
    <AppBar
      sx={{
        display: { xs: 'flex', md: 'none' },
        top: 0,
        zIndex: 1200,
      }}
    >
      <Toolbar sx={{ minHeight: 68, px: 2 }}>
        <IconButton
          size="large"
          edge="start"
          aria-label="Abrir navegación"
          onClick={toggleSideMenu}
          sx={{ color: theme.black, mr: 1 }}
        >
          <MenuRounded />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '14px',
              backgroundColor: 'rgba(102, 224, 230, 0.18)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Image src="/saludentis.webp" width={28} height={28} alt="Saludentis" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: theme.lightSeaGreen, lineHeight: 1 }}>
              Saludentis
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dashboard
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
