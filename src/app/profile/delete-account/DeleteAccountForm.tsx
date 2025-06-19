'use client'

import { useActionState, useEffect } from 'react'
import { deleteMyProfileAction } from './actions'
import { signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { DeleteMyProfileRequest } from '@/types/api/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteAccountSchema } from '@/schemas/auth/deleteAccountSchema'
import AuthTextField from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'

export default function DeleteAccountForm() {
  const {
    register,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<DeleteMyProfileRequest>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onChange',
  })
  const password = watch('password')
  const [state, formAction, isPending] = useActionState(deleteMyProfileAction, {
    message: '',
  })

  // 폼에 표시해야 하는 서버 액션 에러 메세지
  const passwordError = '비밀번호가 일치하지 않습니다.'

  // 서버 액션 이후
  useEffect(() => {
    if (state.message === '') return

    // 성공시 로그아웃 시키고 홈으로
    if (state.message === 'success') {
      signOut({ callbackUrl: '/' })
      return
    }

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.message === passwordError) {
      setError('password', {
        message: state.message,
      })
    }
  }, [reset, setError, state, watch])

  return (
    <form action={formAction} className='auth-form'>
      <AuthTextField
        type='password'
        placeholder='비밀번호'
        register={register('password')}
        error={errors.password}
        value={password}
        inputDisabled={isPending}
      />
      <AuthSubmitButton
        isPending={isPending}
        isValid={isValid}
        buttonLabel='회원 탈퇴'
        buttonDisabled={!!errors.password || isPending || !isValid}
      />
    </form>
  )
}
