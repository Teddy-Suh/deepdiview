'use server'

import { auth, signOut } from '@/auth'
import { logout } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const signOutWithForm = async () => {
  try {
    const session = await auth()
    const accessToken = session?.accessToken
    if (accessToken) {
      await logout(accessToken)
    }
  } catch (error) {
    console.error(error)
    throw new Error('UNHANDLED_ERROR')
  } finally {
    // access token이 만료되면 try 블록 내의 signOut이 실행되지 않음
    // 로그아웃 버튼 클릭 시 클라이언트 세션은 항상 삭제되도록 처리함
    // TODO: access token 만료(401) 시 처리 로직 추가 필요
    await signOut({ redirect: false })
    redirect('/')
  }
}
