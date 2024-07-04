import '@/styles/globals.css'
import '@fontsource/roboto/700.css'
import 'react-slideshow-image/dist/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
// import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
// import { SWRConfig } from 'swr'

import { AuthProvider, UIProvider } from '@/context'
import { lightTheme } from '@/themes'

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    // Auth context provider 
    <AuthProvider>
      {/* UI context provider */}
      <UIProvider>
        {/* Material Providers */}
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Component {...pageProps} />
          <ToastContainer />
        </ThemeProvider>
      </UIProvider>
    </AuthProvider >
  )
}
