import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    userId: number
    nickname: string
    profileImageUrl: string | null
    role: 'USER' | 'ADMIN'
    accessToken: string
    refreshToken: string
  }

  interface Session {
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: number
    nickname: string
    profileImageUrl: string | null
    role: 'USER' | 'ADMIN'
    accessToken: string
    refreshToken: string
  }
}
