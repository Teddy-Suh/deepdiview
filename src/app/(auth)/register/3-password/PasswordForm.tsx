'use client'

import AuthFormInput from '@/components/form/AuthFormInput'
import AuthSubmitButton from '@/components/form/AuthSubmitButton'
import { useHydrated } from '@/hooks/useHydrated'
import {
  registerPasswordInput,
  registerPasswordSchema,
} from '@/schemas/auth/registerPasswordSchema'
import { useRegisterStore } from '@/stores/useRegisterStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function PasswordForm() {
  const router = useRouter()
  const verified = useRegisterStore((state) => state.verified)
  const { setPassword } = useRegisterStore()
  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<registerPasswordInput>({
    resolver: zodResolver(registerPasswordSchema),
    mode: 'onChange',
  })
  const [password, confirmPassword] = watch(['password', 'confirmPassword'])

  // 에러 동기화 문제 해결
  // confirmPassword에 일치하지 않는다는 에러가 발생한 이후
  // password를 수정해서 일치시켜도
  // confirmPassword는 변경되지 않았기 때문에 에러가 그대로 남음
  // 이를 해결하기 위해 password가 변경되면 newConfirmPassword 필드를 trigger()함
  // 단, newConfirmPassword가 비어있을 때 (입력 전) 굳이 trigger하지 않도록 함
  // 비밀번호 변경에서도 동일한 방식으로 처리함.
  useEffect(() => {
    if (!confirmPassword) return
    trigger('confirmPassword')
  }, [confirmPassword, password, trigger])

  // 다음 페이지로 이동하기 전에 setPassword(password)에 약간의 지연이 생길 수 있으므로
  // 사용자에게 로딩 중임을 명확히 보여주기 위해 isPending 상태를 별도로 관리함
  // 다름 폼에서 서버 액션의 isPending을 AuthFormInput, AuthSubmitButton에 사용하는 방식과 동일하게 활용 가능
  const [isPending, setIsPending] = useState(false)

  const hydrated = useHydrated()
  useEffect(() => {
    if (!hydrated) return

    // 하이드레이션 이후에도 이전 스텝 값 없으면 회원가입 처음부터 다시
    if (!verified) {
      router.replace('/register/1-send-email')
    }
  }, [hydrated, router, verified])

  // 서버 액션 없이 유효성 검사만 통과하면 비밀번호 저장 후 다음 스텝으로 이동
  const onSubmit = () => {
    setIsPending(true)
    setPassword(password)
    router.push('/register/4-nickname')
    return
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-3 md:w-96'>
      <AuthFormInput
        type='password'
        placeholder='비밀번호'
        register={register('password')}
        error={errors.password}
        value={password}
        inputDisabled={isPending}
      />
      <AuthFormInput
        type='password'
        placeholder='비밀번호 확인'
        register={register('confirmPassword')}
        error={errors.confirmPassword}
        value={confirmPassword}
        inputDisabled={isPending}
      />
      <AuthSubmitButton isPending={isPending} isValid={isValid} buttonLabel='다음' />
    </form>
  )
}
