'use client'

import { useActionState, useEffect } from 'react'
import { updatePasswordAction } from './actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UpdatePasswordRequest } from '@/types/api/user'
import { updatePasswordSchema } from '@/schemas/auth/updatePasswordSchema'
import AuthTextField from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'
import { USER_CODES, USER_MESSAGES } from '@/constants/messages/users'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

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
    code: '',
  })

  // 서버 액션 이후
  // 성공시 클라이언트에서 할 것 없음
  // 서버 액션에서 리디렉션 처리
  useEffect(() => {
    if (state.code === '') return

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 토스트 메세지로 띄워야 하는 에러
    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.code === USER_CODES.NOT_VALID_PASSWORD) {
      setError('currentPassword', {
        message: USER_MESSAGES.NOT_VALID_PASSWORD,
      })
    }
  }, [reset, setError, state, watch, isPending])

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
