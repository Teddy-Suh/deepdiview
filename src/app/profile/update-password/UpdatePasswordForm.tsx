'use client'

import { useActionState, useEffect } from 'react'
import { updatePasswordAction } from './actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UpdatePasswordRequest } from '@/types/api/user'
import { updatePasswordSchema } from '@/schemas/auth/updatePasswordSchema'
import AuthTextField from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'

export default function UpdatePasswordForm() {
  const {
    register,
    watch,
    reset,
    setError,
    trigger,
    formState: { errors, isValid },
  } = useForm<UpdatePasswordRequest>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'all',
  })
  const [currentPassword, newPassword, newConfirmPassword] = watch([
    'currentPassword',
    'newPassword',
    'newConfirmPassword',
  ])

  // 에러 동기화 문제 해결
  useEffect(() => {
    if (!newConfirmPassword) return
    trigger('newConfirmPassword')
  }, [newConfirmPassword, newPassword, trigger])

  useEffect(() => {
    if (!newPassword) return
    trigger('newPassword')
  }, [newPassword, currentPassword, trigger])

  const [state, formAction, isPending] = useActionState(updatePasswordAction, {
    message: '',
  })

  // 폼에 표시해야 하는 서버 액션 에러 메세지
  const currentPasswordError = '현재 비밀번호가 일치하지 않습니다.'

  // 서버 액션 이후
  // 성공시 클라이언트에서 할 것 없음
  // 서버 액션에서 리디렉션 처리
  useEffect(() => {
    if (isPending) return
    if (state.message === '') return

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.message === currentPasswordError) {
      setError('currentPassword', {
        message: state.message,
      })
    }
  }, [reset, setError, state.message, watch, isPending])

  return (
    <form action={formAction} className='auth-form'>
      <AuthTextField
        type='password'
        placeholder='현재 비밀번호'
        register={register('currentPassword')}
        error={errors.currentPassword}
        value={currentPassword}
      />
      <AuthTextField
        type='password'
        placeholder='새 비밀번호'
        register={register('newPassword')}
        error={errors.newPassword}
        value={newPassword}
      />
      <AuthTextField
        type='password'
        placeholder='새 비밀번호 확인'
        register={register('newConfirmPassword')}
        error={errors.newConfirmPassword}
        value={newConfirmPassword}
      />
      <AuthSubmitButton
        isPending={isPending}
        isValid={isValid}
        buttonLabel='비밀번호 변경'
        buttonDisabled={!!errors.currentPassword || isPending || !isValid}
      />
    </form>
  )
}
