import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-toastify/dist/ReactToastify.css'

import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

import { AuthProvider, UIProvider } from '@/context'
import { lightTheme } from '@/themes'

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <UIProvider>
          <AuthProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
              <ToastContainer stacked />
            </ThemeProvider>
          </AuthProvider >
        </UIProvider>
      </SessionProvider>
    </>
  )
}
