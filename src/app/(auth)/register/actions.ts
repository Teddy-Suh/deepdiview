'use server'

import { register } from '@/lib/api/user'
import { sendEmail, verifyEmail } from '@/lib/api/email'
import { registerSchema } from '@/schemas/auth/registerSchema'
import { verifyEmailSchema } from '@/schemas/auth/verifyEmailSchema'
import { emailSchema } from '@/schemas/common/email'

export const registerAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    nickname: formData.get('nickname'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    throw new Error('INVALID')
  }

  const { email, nickname, password, confirmPassword } = validatedFields.data

  try {
    await register({
      email,
      nickname,
      password,
      confirmPassword,
    })
    return { ...state, message: 'success' }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'ALREADY_EXIST_NICKNAME':
        return { ...state, message: '중복된 닉네임입니다.' }
      case 'EMAIL_NOT_VERIFIED':
        return { ...state, message: '이메일 인증이 만료되었습니다.' }

      // 아래 에러들은 클라이언트에서 이미 유효성 검사를 수행했기 때문에
      // 이 단계에서 발생한다면 비정상적인 흐름(직접 API 호출 등)으로 간주함
      // default 블록에서 'UNHANDLED_ERROR' 에러 던져 에러페이지로 이동함

      // case 'ALREADY_EXIST_MEMBER':
      //   return { ...state, message: '이미 존재하는 이메일입니다.' }
      // case 'NOT_MATCHED_PASSWORD':
      //   return { ...state, message: '확인용 비밀번호와 일치하지 않습니다.' }

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

export const sendEmailAction = async (state: { message: string }, formData: FormData) => {
  const validated = emailSchema.safeParse(formData.get('email'))

  if (!validated.success) {
    throw new Error('INVALID')
  }
  const email = validated.data

  try {
    await sendEmail({
      email,
    })
    return { ...state, message: 'success' }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'ALREADY_EXIST_MEMBER':
        return { ...state, message: '중복된 이메일입니다.' }
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

export const verifyEmailAction = async (state: { message: string }, formData: FormData) => {
  const validatedFields = verifyEmailSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
  })

  if (!validatedFields.success) {
    throw new Error('INVALID')
  }

  const { email, code } = validatedFields.data

  try {
    await verifyEmail({
      email,
      code,
    })
    return { ...state, message: 'success' }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'EXPIRED_CODE':
        return { ...state, message: '코드가 만료되었습니다.' }
      case 'INVALID_CODE':
        return { ...state, message: '코드가 일치하지 않습니다.' }
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
