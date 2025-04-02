import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { apiClient } from './lib/apiClient'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('❌ [authorize] 이메일, 비밀번호 누락')
          }

          // TODO: 로그인 API 모듈 분리 및 타입 정의 예정
          const user = await apiClient<LoginResponse, LoginRequest>('/users/login', {
            method: 'POST',
            body: {
              email: credentials.email,
              password: credentials.password,
            },
          })

          console.log('✅ [authorize] 로그인 성공')
          return user
        } catch (error) {
          console.error('❌ [authorize] 로그인 실패:', error)

          const e = error as Error
          throw new Error(e.message)
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 15 - 60 * 10, // refreshToken 유효기간(15일) 10분 전,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        Object.assign(token, user) // 이미 필요한것만 받아서 다 넣음
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        userId: token.userId,
        email: token.email,
        nickname: token.nickname,
        profileImageUrl: token.profileImageUrl,
        role: token.role,
      }
      session.accessToken = token.accessToken // refreshToken은 보안을 위해 넣지 않음
      return session
    },
  },
})
