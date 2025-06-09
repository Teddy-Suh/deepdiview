'use client'

import { useActionState, useEffect } from 'react'
import { sendEmailAction } from '../actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendEmailRequest } from '@/types/api/email'
import { sendEmailSchema } from '@/schemas/auth/sendEmailSchema'
import { useRegisterStore } from '@/stores/useRegisterStore'
import { useRouter } from 'next/navigation'
import AuthFormInput from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'

export default function SendEmailForm() {
  const router = useRouter()
  const { setEmail } = useRegisterStore()
  const {
    register,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<SendEmailRequest>({
    resolver: zodResolver(sendEmailSchema),
    mode: 'onChange',
  })
  const email = watch('email')
  const [state, formAction, isPending] = useActionState(sendEmailAction, {
    message: '',
  })

  // 폼에 표시해야 하는 서버 액션 에러 메세지
  const emailError = '중복된 이메일입니다.'

  // 서버 액션 이후
  useEffect(() => {
    if (isPending) return
    if (state.message === '') return

    // 성공시
    if (state.message === 'success') {
      setEmail(email)
      router.push('/register/2-verify-email')
      return
    }

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.message === emailError) {
      setError('email', {
        message: state.message,
      })
    }
  }, [email, isPending, reset, router, setEmail, setError, state.message, watch])

  return (
    <form action={formAction} className='auth-form'>
      <AuthFormInput
        type='email'
        placeholder='이메일'
        register={register('email')}
        error={errors.email}
        value={email}
        inputDisabled={isPending}
      />
      <AuthSubmitButton
        isPending={isPending}
        isValid={isValid}
        buttonLabel='인증 코드 전송'
        buttonDisabled={!!errors.email || isPending || !isValid}
      />
    </form>
  )
}
