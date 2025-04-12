'use server'

import { register } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const registerAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const nickname = formData.get('nickname') as string

  try {
    await register({
      email,
      password,
      confirmPassword,
      nickname,
    })
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'ALREADY_EXIST_MEMBER':
        return { ...state, message: '이미 존재하는 이메일 입니다.' }
      case 'ALREADY_EXIST_NICKNAME':
        return { ...state, message: '중복된 닉네임 입니다.' }
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
  redirect('/login') // 회원가입 성공시 로그인으로 리디렉션
}
