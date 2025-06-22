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
import toast from 'react-hot-toast'
import { EMAIL_CODES, EMAIL_MESSAGES } from '@/constants/messages/email'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'

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
    code: '',
  })

  // 서버 액션 이후
  useEffect(() => {
    if (state.code === '') return

    // 성공시
    if (state.code === COMMON_CODES.SUCCESS) {
      setEmail(email)
      router.push('/register/2-verify-email')
      return
    }

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.code === EMAIL_CODES.ALREADY_EXIST_MEMBER) {
      setError('email', {
        message: EMAIL_MESSAGES.ALREADY_EXIST_MEMBER,
      })
      return
    }

    // 토스트 메세지로 띄워야 하는 에러
    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [email, reset, router, setEmail, setError, state, watch])

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
