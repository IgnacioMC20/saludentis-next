import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>

        <link rel='icon' href='/saludentis.ico' />
      </Head>
      <body style={{
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        width: '100%',
      }}>
        <Main />
        <NextScript />
      </body>
    </Html >
  )
}
