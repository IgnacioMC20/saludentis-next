import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Saludentis App</title>
        <meta name='description' content='Saludentis App' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/saludentis.ico' />
      </Head>
      <body style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'url("https://previews.123rf.com/images/seamartini/seamartini1904/seamartini190400771/121700804-dental-medicine-seamless-patter-vector-background-of-dentistry-line-icons-dentist-doctor-with-tooth-.jpg")',
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
