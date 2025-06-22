'use server'

import { register } from '@/lib/api/user'
import { sendEmail, verifyEmail } from '@/lib/api/email'
import { registerSchema } from '@/schemas/auth/registerSchema'
import { verifyEmailSchema } from '@/schemas/auth/verifyEmailSchema'
import { emailSchema } from '@/schemas/common/email'
import { EMAIL_CODES } from '@/constants/messages/email'
import { COMMON_CODES } from '@/constants/messages/common'
import { USER_CODES } from '@/constants/messages/users'

export const registerAction = async (
  state: { code: string } = { code: '' },
  formData: FormData
) => {
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    nickname: formData.get('nickname'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { email, nickname, password, confirmPassword } = validatedFields.data

  try {
    await register({
      email,
      nickname,
      password,
      confirmPassword,
    })
    return { ...state, code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case USER_CODES.ALREADY_EXIST_NICKNAME:
      case USER_CODES.EMAIL_NOT_VERIFIED:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const sendEmailAction = async (state: { code: string }, formData: FormData) => {
  const validated = emailSchema.safeParse(formData.get('email'))

  if (!validated.success) {
    throw new Error(COMMON_CODES.INVALID)
  }
  const email = validated.data

  try {
    await sendEmail({
      email,
    })
    return { ...state, code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case EMAIL_CODES.ALREADY_EXIST_MEMBER:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const verifyEmailAction = async (state: { code: string }, formData: FormData) => {
  const validatedFields = verifyEmailSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { email, code } = validatedFields.data

  try {
    await verifyEmail({
      email,
      code,
    })
    return { ...state, code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case EMAIL_CODES.EXPIRED_CODE:
      case EMAIL_CODES.INVALID_CODE:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
