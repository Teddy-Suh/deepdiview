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

export declare module '@auth/core/jwt' {
  interface JWT {
    userId: number
    nickname: string
    profileImageUrl: string | null
    role: 'USER' | 'ADMIN'
    accessToken: string
    refreshToken: string
  }
}
