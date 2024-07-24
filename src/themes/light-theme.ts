import { createTheme } from '@mui/material/styles'

export const theme = {
  lightSeaGreen: '#0bc0c0',
  robinEggBlue: '#3dccc7',
  tiffanyBlue: '#68d8d6',
  celeste: '#9ceaef',
  celeste2: '#c4fff9',
  purple: '#7600bc',
  white: '#fff',
  black: '#000',
  gray: '#f5f5f5',
  skyBlue: '#87ceeb',
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: theme.lightSeaGreen
    },
    secondary: {
      main: theme.purple
    },
    info: {
      main: theme.white
    }
  },
  components: {
    
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: theme.lightSeaGreen,
          ':hover': {
            textDecoration: 'underline',
            transition: 'all 0.3s ease-in-out',
          }
        }
      }
    },

    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          height: 60
        },
      }
    },

    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'small',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          color: theme.white,
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 10,
          padding: '1rem',
          minWidth: '120px',
          ':hover': {
            backgroundColor: theme.robinEggBlue,
            color: theme.white,
            transition: 'all 0.3s ease-in-out',
          }
        },
        outlinedPrimary: {
          color: theme.robinEggBlue,
          border: `1px solid ${theme.robinEggBlue}`,
          ':hover': {
            backgroundColor: theme.robinEggBlue,
            color: `${theme.black} !important`,
            transition: 'all 0.3s ease-in-out',
          }
        },
      }
    },

    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          boxShadow: '0px 5px 5px rgba(0,0,0,0.05)',
          borderRadius: '10px',
          padding: '1rem'
        }
      }
    }

  }
})