'use server'

import { auth, signOut } from '@/auth'
import { logout, updateIntro } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const updateIntroAction = async (
  state: { message: string; intro: string } = { message: '', intro: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const oneLineIntro = formData.get('oneLineIntro') as string

  try {
    const updatedOneLineIntro = (
      await updateIntro(session.accessToken, {
        oneLineIntro,
      })
    ).updatedOneLineIntro
    return { ...state, message: 'success', intro: updatedOneLineIntro ?? '' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}

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
