'use server'

import { auth } from '@/auth'
import { updatePassword } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const updatePasswordAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const userId = session.user?.userId

  // TODO: 유효성 검사 (zod)
  const newPassword = formData.get('newPassword') as string
  const newConfirmPassword = formData.get('newConfirmPassword') as string

  try {
    await updatePassword(session.accessToken, {
      newPassword,
      newConfirmPassword,
    })
  } catch (error: unknown) {
    // TODO: VALIDATION_FAILED 에러 처리 개선 (에러 타입 정의, Zod 연동)
    // 현재는 validErrors 메시지를 조합해서 단일 message로만 반환
    if (
      typeof error === 'object' &&
      error !== null &&
      'errorCode' in error &&
      (error as { errorCode: string }).errorCode === 'VALIDATION_FAILED' &&
      'validErrors' in error &&
      typeof (error as { validErrors: unknown }).validErrors === 'object'
    ) {
      const messages = Object.values((error as { validErrors: Record<string, string> }).validErrors)
      const combinedMessage = messages.join('/')
      return { ...state, message: combinedMessage || '입력값 오류' }
    }
    if (error instanceof Error) {
      const errorCode = error.message
      if (errorCode === 'NOT_VALID_PASSWORD') {
        return { ...state, message: '비밀번호가 일치하지 않습니다.' }
      }
    }

    // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
    console.error(error)
    // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
    throw new Error('UNHANDLED_ERROR')
  }
  redirect(`/profile/${userId}`)
}
