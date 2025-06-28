'use server'

import { signIn } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { USER_CODES } from '@/constants/messages/users'
import { loginSchema } from '@/schemas/auth/loginSchema'
import { redirect } from 'next/navigation'

export const signInWithCredentials = async (
  from: string | null,
  state: { code: string },
  formData: FormData
) => {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,

      // redirectTo는 try 문 안에서 동작하지 않지만 명시적으로 redirect 호출해야 함
      redirect: false, // false로 해두고 아래에서 직접 처리하기
    })
  } catch (error) {
    const e = error as Error & {
      cause?: { err?: { message?: string } }
    }
    const errorCode = e?.cause?.err?.message ?? ''

    switch (errorCode) {
      case USER_CODES.USER_NOT_FOUND:
      case USER_CODES.NOT_VALID_PASSWORD:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }

  const isSafeFrom =
    from &&
    from.startsWith('/') &&
    !from.startsWith('//') &&
    !from.startsWith('/login') &&
    !from.startsWith('/register')

  redirect(isSafeFrom ? from : '/')
}
