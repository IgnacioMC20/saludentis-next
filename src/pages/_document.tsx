import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body style={{
        alignContent: 'center',
        background: 'url("https://previews.123rf.com/images/seamartini/seamartini1904/seamartini190400771/121700804-dental-medicine-seamless-patter-vector-background-of-dentistry-line-icons-dentist-doctor-with-tooth-.jpg")',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}>
      <Main />
      <NextScript />
    </body>
    </Html >
  )
}
