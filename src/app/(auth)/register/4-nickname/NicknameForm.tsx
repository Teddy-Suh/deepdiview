'use client'

import { useActionState, useEffect, useState } from 'react'
import { registerAction } from '../actions'
import { useForm } from 'react-hook-form'
import { RegisterRequest } from '@/types/api/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/schemas/auth/registerSchema'
import { useRegisterStore } from '@/stores/useRegisterStore'
import { useRouter } from 'next/navigation'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'
import AuthFormInput from '@/components/form/AuthFormInput'
import { useHydrated } from '@/hooks/useHydrated'
import { USER_CODES, USER_MESSAGES } from '@/constants/messages/users'
import toast from 'react-hot-toast'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'

export default function NicknameForm() {
  const router = useRouter()
  const email = useRegisterStore((state) => state.email)
  const password = useRegisterStore((state) => state.password)
  const verified = useRegisterStore((state) => state.verified)
  const {
    register,
    watch,
    reset,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })
  const nickname = watch('nickname')
  const [state, formAction, isPending] = useActionState(registerAction, {
    code: '',
  })
  // 회원가입 성공 시 store를 비우고 로그인 페이지로 이동시키는데,
  // store가 비워진 직후 재렌더되면서 아래 조건문이 다시 실행되고
  // 이전 스텝 값(email, password 등)이 사라져 처음 스텝으로 보냄
  // 이를 방지하기 위해 isRegistered 플래그로 이미 성공했는지 체크하여 렌더 차단
  const [isRegistered, setIsRegistered] = useState(false)

  const hydrated = useHydrated()
  useEffect(() => {
    if (!hydrated || isRegistered) return

    // 하이드레이션 이후에도 이전 스텝 값 없으면 회원가입 처음부터 다시
    if (!email || !verified || !password) {
      return router.replace('/register/1-send-email')
    }

    // 새로고침 이후에도 이메일, 비밀번호, 비밀번호 확인 input에 값 주입하기
    setValue('email', email)
    setValue('password', password)
    setValue('confirmPassword', password)
  }, [email, hydrated, isRegistered, password, router, setValue, verified])

  // 서버 액션 이후
  useEffect(() => {
    if (state.code === '') return

    // 성공시
    if (state.code === COMMON_CODES.SUCCESS) {
      setIsRegistered(true)
      useRegisterStore.getState().reset()
      useRegisterStore.persist.clearStorage?.()
      router.replace('/login')
      return
    }

    // 실패시
    // 이메일 인증 만효 에러면 첫 단계로 보내기
    if (state.code === USER_CODES.EMAIL_NOT_VERIFIED) {
      toast.error(USER_MESSAGES.EMAIL_NOT_VERIFIED)
      router.replace('/register/1-send-email')
    }

    // 실패 시 폼 돌려 놓기
    reset(watch())

    // 토스트 메세지로 띄워야 하는 에러
    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }

    // 폼에 표시해야 하는 서버 액션 에러 메세지는 각 폼에 setError
    if (state.code === USER_CODES.ALREADY_EXIST_NICKNAME) {
      setError('nickname', {
        message: USER_MESSAGES.ALREADY_EXIST_NICKNAME,
      })
      return
    }
  }, [reset, router, setError, state, watch])

  return (
    <>
      <form action={formAction} className='auth-form'>
        <input type='hidden' {...register('email')} />
        <input type='hidden' {...register('password')} />
        <input type='hidden' {...register('confirmPassword')} />
        <AuthFormInput
          placeholder='닉네임'
          register={register('nickname')}
          error={errors.nickname}
          value={nickname}
          inputDisabled={isPending}
        />
        <AuthSubmitButton
          isPending={isPending}
          isValid={isValid}
          buttonLabel='회원가입'
          buttonDisabled={!!errors.nickname || isPending || !isValid}
        />
      </form>
    </>
  )
}
