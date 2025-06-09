'use server'

import { auth } from '@/auth'
import { updatePassword } from '@/lib/api/user'
import { updatePasswordSchema } from '@/schemas/auth/updatePasswordSchema'
import { redirect } from 'next/navigation'

export const updatePasswordAction = async (state: { message: string }, formData: FormData) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const userId = session.user?.userId

  const validatedFields = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    newConfirmPassword: formData.get('newConfirmPassword'),
  })

  if (!validatedFields.success) {
    throw new Error('INVALID')
  }

  const { currentPassword, newPassword, newConfirmPassword } = validatedFields.data

  try {
    await updatePassword(session.accessToken, {
      currentPassword,
      newPassword,
      newConfirmPassword,
    })
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'NOT_VALID_PASSWORD':
        return { ...state, message: '현재 비밀번호가 일치하지 않습니다.' }
      case 'NOT_MATCHED_PASSWORD':
        return { ...state, message: '확인용 비밀번호와 일치하지 않습니다.' }
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
  redirect(`/profile/${userId}`)
}
