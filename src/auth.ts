import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { login } from './lib/api/user'
import { LoginRequest } from './types/api/user'

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as unknown as LoginRequest
        try {
          if (!email || !password) {
            throw new Error('❌ [authorize] 이메일, 비밀번호 누락')
          }

          const user = await login({
            email,
            password,
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
    maxAge: 60 * 60 * 24 * 15 - 60 * 10, // refreshToken 유효기간(15일) 10분 전
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userId = user.userId
        token.email = user.email!
        token.nickname = user.nickname
        token.profileImageUrl = user.profileImageUrl
        token.role = user.role
        token.accessToken = user.accessToken
      }

      if (trigger === 'update' && session) {
        if (session.user.nickname) {
          token.nickname = session.user.nickname
        }
        if (session.user.profileImageUrl) {
          token.profileImageUrl = session.user.profileImageUrl
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.userId = token.userId
        session.user.email = token.email!
        session.user.nickname = token.nickname
        session.user.profileImageUrl = token.profileImageUrl
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
      return session
    },
  },
})
