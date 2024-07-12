import { NextResponse, type NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const session = true
  // const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl
  // console.log('===middleware', pathname)

  // Allow access to login page if there's no session
  if (!session && pathname === '/auth/login') {
    console.log('===middleware', 'next')
    return NextResponse.next()
  }

  // Redirect to home page if there's a session and the user is on the login page
  if (session && pathname === '/auth/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to login page if there's no session and the user is not on the login page
  if (!session && pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Continue with the request for all other cases
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
