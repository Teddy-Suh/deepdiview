'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateIntroAction } from './actions'
import { Check, Pencil, X } from 'lucide-react'
import clsx from 'clsx'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { UpdateIntroRequest } from '@/types/api/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateIntroSchema } from '@/schemas/user/updateIntroSchema'

export default function IntroForm({
  isCurrentUser,
  oneLineIntro,
  isEdit,
}: {
  isCurrentUser: boolean
  oneLineIntro: string
  isEdit: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [prevIntro, setPrevIntro] = useState('')
  // 닉네임은 수정 성공시 세션을 갱신 하기 때문에 리렌더링되어 이전값 상태 관리 필요 없음
  // 한 줄 소개는 세션에 포함되지 않기 때문에 수동으로 상태를 관리 필요
  // 첫 편집 시 취소하면 oneLineIntro를 그대로 복구하면 되지만,
  // 이미 한 번 수정한 이후 다시 편집을 취소할 경우에는,
  // 초기 oneLineIntro가 아니라 직전에 저장된 값을 복원해야 하므로 prevIntro로 따로 저장해둠.

  const [state, formAction, isPending] = useActionState(updateIntroAction, {
    code: '',
    intro: '',
  })

  const {
    register,
    watch,
    setValue,
    setFocus,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateIntroRequest>({
    resolver: zodResolver(updateIntroSchema),
    mode: 'onChange',
    defaultValues: {
      oneLineIntro,
    },
  })

  const intro = watch('oneLineIntro')

  // 수정 성공
  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.SUCCESS) {
      setValue('oneLineIntro', state.intro)
      setIsEditing(false)
      setPrevIntro(intro)
    }

    // 실패시
    // 폼돌려 놓기
    reset(watch())

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // 편집 모드 시작
  useEffect(() => {
    if (isEditing) {
      setPrevIntro(intro)
      setFocus('oneLineIntro')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing])

  // 밖에서 isEdit으로 편집 모드 종료
  useEffect(() => {
    if (isEdit === false) {
      setIsEditing(false)
      // 초기 렌더링(isEdit === false) 시
      // prevIntro의 초기값인 빈문자열로 setIntro(prevIntro) 방지
      if (prevIntro !== '') {
        setValue('oneLineIntro', state.intro)
      }
    }
  }, [isEdit, prevIntro, setValue, state.intro])

  if (!isCurrentUser)
    return (
      <div className='bg-base-100 w-full rounded-3xl p-4'>
        <p className={clsx('text-center', !intro && 'text-gray-500')}>
          {intro || '한 줄 소개가 없습니다.'}
        </p>
      </div>
    )

  return (
    <div className='w-full'>
      {isEditing ? (
        <form action={formAction}>
          <div className='bg-base-100 relative rounded-3xl p-4'>
            <input
              {...register('oneLineIntro')}
              className='w-full border-none text-center outline-none'
              type='text'
              disabled={isPending}
            />
            <div>
              <button
                className='profile-btn -top-2.5 -right-2.5'
                type='submit'
                disabled={isPending || !isValid}
              >
                {isPending ? (
                  <span className='loading loading-spinner' />
                ) : (
                  <Check className='stroke-3' />
                )}
              </button>
              <button
                className='profile-btn bg-error -top-2.5 right-5.5 rounded-full'
                type='button'
                onClick={() => {
                  setIsEditing(false)
                  setValue('oneLineIntro', prevIntro)
                }}
              >
                <X className='stroke-3' />
              </button>
            </div>
          </div>
          {errors.oneLineIntro?.message && (
            <p className='text-error mt-2 text-center text-sm'>{errors.oneLineIntro.message}</p>
          )}
        </form>
      ) : (
        <div className='bg-base-100 relative w-full rounded-3xl p-4'>
          <p className={clsx('text-center', !intro && 'text-gray-500')}>
            {intro || '한 줄 소개가 없습니다.'}
          </p>
          {isEdit && (
            <button
              className='profile-btn -top-2.5 -right-2.5'
              type='button'
              onClick={() => setIsEditing(true)}
            >
              <Pencil className='stroke-base-content fill-base-100 stroke-2' />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
