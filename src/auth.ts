import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { login, refreshAccessToken } from './lib/api/user'
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
        const user = await login({
          email,
          password,
        })
        return user
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
      // 로그인
      if (user) {
        token.userId = user.userId
        token.email = user.email!
        token.nickname = user.nickname
        token.profileImageUrl = user.profileImageUrl
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = Date.now() + 3600 * 1000 // 현재 시간 + accessToken 유효기간(1시간)
        return token
      }
      // accessToken 유효기간(1시간) 10분 전 부터 accessToken 재발급
      // TODO: 에러 처리
      if (Date.now() > token.accessTokenExpires - 10 * 60 * 1000) {
        if (!token.refreshToken) {
          throw new Error('MISSING_REFRESH_TOKEN')
        }
        try {
          const { newAccessToken } = await refreshAccessToken(token.refreshToken)
          return {
            ...token,
            accessToken: newAccessToken,
            accessTokenExpires: Date.now() + 3600 * 1000,
          }
        } catch (error) {
          console.error('❌ [jwt] 액세스 토큰 재발급 실패:', error)

          const e = error as Error
          throw new Error(e.message)
        }
      }
      // 세션 업데이트 (닉네임, 프로필 이미지 변경)
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
        session.accessTokenExpires = token.accessTokenExpires
      }
      return session
    },
  },
})
