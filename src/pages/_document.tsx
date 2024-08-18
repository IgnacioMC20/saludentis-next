import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        
        <link rel='icon' href='/saludentis.ico' />
      </Head>
      <body style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url(' + '/background-default.jpg' + ')',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        minHeight: '100vh',
        margin: 0,
        padding: 0
      }}>
        <Main />
        <NextScript />
      </body>
    </Html >
  )
}
