import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'react-toastify/dist/ReactToastify.css'
import '../components/Odontogram/App.css'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

import { AuthProvider, UIProvider } from '@/context'
import { lightTheme } from '@/themes'

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const queryClient = new QueryClient()
  return (
    <>

      <QueryClientProvider client={queryClient}>
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
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </>
  )
}
