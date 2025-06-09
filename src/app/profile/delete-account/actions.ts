'use server'

import { auth } from '@/auth'
import { deleteMyProfile } from '@/lib/api/user'
import { deleteAccountSchema } from '@/schemas/auth/deleteAccountSchema'

export const deleteMyProfileAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  const validatedFields = deleteAccountSchema.safeParse({
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    throw new Error('INVALID')
  }

  const { password } = validatedFields.data

  try {
    await deleteMyProfile(session.accessToken, {
      password,
    })
    return { ...state, message: 'success' }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'ADMIN_CANNOT_BE_DELETED':
        return { ...state, message: '관리자 계정은 삭제할 수 없습니다.' }
      case 'NOT_VALID_PASSWORD':
        return { ...state, message: '비밀번호가 일치하지 않습니다.' }
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
