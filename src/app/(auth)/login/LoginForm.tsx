'use client'

import { useActionState, useEffect } from 'react'
import { signInWithCredentials } from './actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginRequest } from '@/types/api/user'
import { loginSchema } from '@/schemas/auth/loginSchema'
import Link from 'next/link'
import AuthFormInput from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithCredentials, { message: '' })

  const {
    register,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const [email, password] = watch(['email', 'password'])

  // 폼에 표시해야 하는 서버 액션 에러 메세지
  const emailError = '가입되지 않은 이메일입니다.'
  const passwordError = '비밀번호가 일치하지 않습니다.'

  // 서버 액션 이후
  // 성공시 클라이언트에서 할 것 없음
  // 서버 액션에서 리디렉션 처리
  useEffect(() => {
    if (isPending) return
    if (state.message === '') return

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.message === emailError) {
      setError('email', {
        message: state.message,
      })
    }
    if (state.message === passwordError) {
      setError('password', {
        message: state.message,
      })
    }
  }, [isPending, reset, setError, state.message, watch])
  // isPending 넣은 이유
  // 서버 액션 실패 후 state.message에 에러 메시지가 남아 있는 상태에서
  // 같은 에러가 다시 발생하면 state.message 값이 변하지 않아 reset(watch())가 실행되지 않음
  // 따라서 서버 액션 실행 시마다 값이 바뀌는 상태를 의존성으로 넣어야 함
  // useState로 count 등을 만들어 트리거할 수도 있지만
  // isPending은 매번 액션 실행 시 변경되므로 이를 활용해 문제 해결
  // 회원가입, 비밀번호 변경, 회원 탈퇴 등에서도 동일한 방식으로 사용 중

  return (
    <form action={formAction} className='auth-form'>
      <AuthFormInput
        type='email'
        placeholder='이메일'
        register={register('email')}
        error={errors.email}
        value={email}
      />
      <AuthFormInput
        type='password'
        placeholder='비밀번호'
        register={register('password')}
        error={errors.password}
        value={password}
      />
      <AuthSubmitButton
        isPending={isPending}
        isValid={isValid}
        buttonLabel='로그인'
        buttonDisabled={!!errors.email || !!errors.password || isPending || !isValid}
      >
        <Link
          href='/register/1-send-email'
          className='btn btn-secondary mt-3 hidden w-full rounded-xl md:flex'
        >
          회원가입
        </Link>
      </AuthSubmitButton>
    </form>
  )
}
