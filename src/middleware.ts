import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getServerSession } from './lib/actions/auth'
import { match } from 'path-to-regexp'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 비로그인 사용자만 접근 가능
  if (isMatch(pathname, authRoutes)) {
    return (await getServerSession())
      ? NextResponse.redirect(new URL('/', request.url))
      : NextResponse.next()
  }

  // 로그인 사용자만 접근 가능
  if (isMatch(pathname, privateRoutes)) {
    return (await getServerSession())
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/login', request.url))
  }

  // 관리자만 접근 가능
  if (isMatch(pathname, adminRoutes)) {
    const session = await getServerSession()
    const role = session?.user?.role
    return session
      ? role === 'ADMIN'
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/', request.url))
      : NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

function isMatch(pathname: string, urls: string[]) {
  return urls.some((url) => {
    const matcher = match(url)
    return matcher(pathname) !== false
  })
}

const authRoutes = ['/login', '/register']

const privateRoutes = [
  '/board/*path',
  '/movies/:path/reviews/create',
  '/notifications',
  '/profile/*path',
  '/reviews/:path/edit',
]

const adminRoutes = ['/admin/*path']
