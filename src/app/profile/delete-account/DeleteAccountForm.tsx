'use client'

import { useActionState, useEffect } from 'react'
import { deleteMyProfileAction } from './actions'
import { useForm } from 'react-hook-form'
import { DeleteMyProfileRequest } from '@/types/api/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteAccountSchema } from '@/schemas/auth/deleteAccountSchema'
import AuthTextField from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'
import { USER_CODES, USER_MESSAGES } from '@/constants/messages/users'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

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
    code: '',
  })

  // 서버 액션 이후
  // 성공시 서버 액션에서 리디렉션
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
      setError('password', {
        message: USER_MESSAGES.NOT_VALID_PASSWORD,
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
