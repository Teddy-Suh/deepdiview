'use client'

import { useActionState, useEffect, useState } from 'react'
import { sendEmailAction, verifyEmailAction } from '../actions'
import { useForm } from 'react-hook-form'
import { VerifyEmailRequest } from '@/types/api/email'
import { verifyEmailSchema } from '@/schemas/auth/verifyEmailSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRegisterStore } from '@/stores/useRegisterStore'
import { useRouter } from 'next/navigation'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'
import AuthFormInput from '@/components/form/AuthFormInput'
import { useHydrated } from '@/hooks/useHydrated'

export default function VerifyEmailForm() {
  const router = useRouter()
  const email = useRegisterStore((state) => state.email)
  const { setVerified } = useRegisterStore()
  const {
    register,
    watch,
    reset,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<VerifyEmailRequest>({
    resolver: zodResolver(verifyEmailSchema),
    mode: 'onChange',
    defaultValues: {
      email: email,
    },
  })
  const code = watch('code')
  const [state, formAction, isPending] = useActionState(verifyEmailAction, {
    message: '',
  })
  const [sendState, sendFormAction, isSendPending] = useActionState(sendEmailAction, {
    message: '',
  })

  // 폼에 표시해야 하는 서버 액션 에러 메세지
  const codeError = '코드가 일치하지 않습니다.'
  const codeExpiredError = '코드가 만료되었습니다.'

  // 클라이언트 하이드레이션 이전에는 zustand 값이 비어있을 수 있으므로, 하이드레이션 완료 후 처리
  // (해당 처리 없으면 새로고침시 email없다고 판단 후 이전 스텝으로 돌아감)
  const hydrated = useHydrated()
  useEffect(() => {
    if (!hydrated) return

    // 하이드레이션 이후에도 이전 스텝 값 없으면 회원가입 처음부터 다시
    if (!email) {
      return router.replace('/register/1-send-email')
    }

    // 새로고침 이후에도 이메일 input에 값 주입하기
    // 해당 처리 없이 input에 value로 넣으면
    // 새로고침 시 zustand에서 값은 잘 받아와 이전 스텝으로 돌아가진 않지만
    // 이메일 input이 비어있어서 에러남
    setValue('email', email)
  }, [email, hydrated, router, setValue])

  // 서버 액션 이후
  useEffect(() => {
    if (state.message === '') return

    // 성공시
    if (state.message === 'success') {
      setVerified(true)
      // 이메일 인증은 성공시 뒤로가기로 다시 접근 못함
      // 다음 스텝에서 뒤로가기시 이메일 입력으로 돌아감
      router.replace('/register/3-password')
      return
    }

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    // 코드 만료되었을때
    if (state.message === codeExpiredError) {
      setTimeLeft(0)
      setError('code', {
        message: state.message,
      })
    }
    // 코드 틀렸을때
    if (state.message === codeError) {
      setError('code', {
        message: state.message,
      })
    }
  }, [codeError, reset, router, setError, setVerified, state, watch])

  // 5분 타이머
  const [timeLeft, setTimeLeft] = useState(300)

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  // 재전송 시
  useEffect(() => {
    // 타이머 초기화
    if (sendState.message === 'success') {
      setTimeLeft(300)
      // 새 코드 받을테니 코드 input 비우기
      reset({
        code: '',
      })
    }
  }, [email, reset, sendState, watch])

  return (
    <>
      <form action={formAction} className='w-full space-y-3 md:w-96'>
        {/* 이메일 (숨김) */}
        <input type='hidden' {...register('email')} />
        {/* 인증 코드 */}
        <AuthFormInput
          placeholder='인증 코드'
          register={register('code')}
          error={errors.code}
          value={code}
          inputDisabled={isPending || timeLeft <= 0 || isSendPending}
        >
          <div className='flex justify-between'>
            <p className='text-error text-sm'>{errors.code && <>{errors.code.message} </>}</p>
            <p className='text-error text-sm'>
              {timeLeft <= 0 ? '유효시간이 만료되었습니다.' : <>{formatTime(timeLeft)}</>}
            </p>
          </div>
        </AuthFormInput>
        <AuthSubmitButton
          isPending={isPending}
          isValid={isValid}
          buttonLabel='인증 확인'
          buttonDisabled={isPending || isSendPending || !!errors.code || !isValid || timeLeft <= 0}
        />
      </form>
      <form
        action={sendFormAction}
        className='absolute top-0 right-4 z-50 flex h-16 items-center md:relative md:right-auto md:-mt-1 md:w-full'
      >
        <input type='hidden' {...register('email')} />
        <button
          className={clsx(
            'btn btn-secondary rounded-xl md:w-full',
            //코드 만료되었을때 재전송 유도를 위한 애니메이션
            timeLeft <= 0 && 'animate-pulse'
          )}
          type='submit'
          disabled={isSendPending || isPending}
        >
          {isSendPending ? <span className='loading loading-ring' /> : '재전송'}
        </button>
      </form>
    </>
  )
}
