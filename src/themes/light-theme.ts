import { alpha, createTheme } from '@mui/material/styles'

import CakeBackground from '../../public/background-1.jpg'
import DefaultBackground from '../../public/background-default.jpg'
import DefualtIcon from '../../public/saludentis.webp'
import CakeIcon from '../../public/saludentisLogo.png'

export const theme = {
  lightSeaGreen: '#008386',
  robinEggBlue: '#66E0E6',
  tiffanyBlue: '#A9EEF0',
  celeste: '#DDF7F8',
  celeste2: '#F2FCFD',
  purple: '#7E5CC2',
  white: '#FFFFFF',
  black: '#1C252C',
  gray: '#F5F7FA',
  skyBlue: '#D5EEF1',
  lightPurple: 'rgba(126, 92, 194, 0.12)',
  lightPink: 'rgba(255, 107, 107, 0.12)',
  amber: '#F4AE3A',
  red: '#FF6B6B',
  border: '#D9E8EA',
  background: '#F4FAFB',
  surface: '#FCFEFF',
  textMuted: '#66788A',
  success: '#22A86F',
}

export const background = {
  default: DefaultBackground,
  cake: CakeBackground
}

export const icon = {
  default: DefualtIcon,
  cake: CakeIcon
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: theme.lightSeaGreen,
      light: theme.robinEggBlue,
    },
    secondary: {
      main: theme.purple,
    },
    info: {
      main: theme.white,
    },
    error: {
      main: theme.red,
    },
    warning: {
      main: theme.amber,
    },
    success: {
      main: theme.success,
    },
    background: {
      default: theme.background,
      paper: theme.surface,
    },
    text: {
      primary: theme.black,
      secondary: theme.textMuted,
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Roboto, system-ui, sans-serif',
    h1: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.55,
    },
    button: {
      fontFamily: 'Outfit, Roboto, sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    caption: {
      lineHeight: 1.4,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.background,
          color: theme.black,
        },
        '#__next': {
          minHeight: '100vh',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: theme.lightSeaGreen,
          transition: 'color 0.25s ease, text-decoration-color 0.25s ease',
          ':hover': {
            textDecoration: 'underline',
          }
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'sticky',
      },
      styleOverrides: {
        root: {
          backgroundColor: theme.white,
          color: theme.black,
          borderBottom: `1px solid ${alpha(theme.border, 0.8)}`,
          backdropFilter: 'blur(14px)',
        },
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '0.8rem 1rem',
          minWidth: '120px',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
          ':hover': {
            transform: 'translateY(-1px)',
          }
        },
        containedPrimary: {
          color: theme.white,
          boxShadow: `0 14px 30px ${alpha(theme.lightSeaGreen, 0.18)}`,
          ':hover': {
            backgroundColor: '#0B9297',
          }
        },
        outlinedPrimary: {
          color: theme.black,
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.white,
          ':hover': {
            backgroundColor: theme.celeste2,
            borderColor: theme.lightSeaGreen,
          }
        },
        containedSecondary: {
          backgroundColor: theme.purple,
          color: theme.white,
          boxShadow: `0 14px 28px ${alpha(theme.purple, 0.2)}`,
          ':hover': {
            backgroundColor: '#6E49B4',
          }
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundColor: theme.white,
          border: `1px solid ${alpha(theme.border, 0.85)}`,
          borderRadius: '22px',
          boxShadow: '0 12px 32px rgba(14, 40, 46, 0.06)',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: theme.textMuted,
          fontSize: '0.78rem',
          fontWeight: 700,
          borderBottom: `1px solid ${alpha(theme.border, 0.9)}`,
        },
        body: {
          borderBottom: `1px solid ${alpha(theme.border, 0.5)}`,
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.white, 0.9),
          borderRadius: 14,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.border, 0.95),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.lightSeaGreen, 0.4),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: theme.lightSeaGreen,
          },
        }
      }
    },
  }
})
