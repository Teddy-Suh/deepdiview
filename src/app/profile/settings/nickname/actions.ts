'use server'

import { auth, update } from '@/auth'
import { updateNickname } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const updateNicknameAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const userId = session.user?.userId

  const newNickname = formData.get('newNickname') as string
  let updatedNickname
  try {
    updatedNickname = (
      await updateNickname(session.accessToken, {
        newNickname,
      })
    ).updatedNickname
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'ALREADY_EXIST_NICKNAME':
        return { ...state, message: '중복 닉네임 입니다' }
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
  // 서버 사이드에서 세션 업데이트
  await update({
    user: {
      nickname: updatedNickname,
    },
  })
  redirect(`/profile/${userId}`)
}
