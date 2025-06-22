'use client'

import { useActionState, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { updateNicknameAction } from './actions'
import { Check, Pencil, X } from 'lucide-react'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { UpdateNicknameRequest } from '@/types/api/user'
import { updateNicknameSchema } from '@/schemas/user/updateNicknameSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { USER_CODES, USER_MESSAGES } from '@/constants/messages/users'

export default function NicknameForm({
  isCurrentUser,
  nickname,
  isEdit,
}: {
  isCurrentUser: boolean
  nickname: string
  isEdit: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputWidth, setInputWidth] = useState(0)
  const spanRef = useRef<HTMLSpanElement>(null)

  const [state, formAction, isPending] = useActionState(updateNicknameAction, {
    code: '',
  })

  const {
    register,
    watch,
    setValue,
    setFocus,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateNicknameRequest>({
    resolver: zodResolver(updateNicknameSchema),
    mode: 'onChange',
    defaultValues: {
      newNickname: nickname,
    },
  })

  const newNickname = watch('newNickname')

  // 서버액션 후
  useEffect(() => {
    if (state.code === '') return

    // 성공시
    if (state.code === COMMON_CODES.SUCCESS) {
      setIsEditing(false)
      return
    }

    // 실패시
    // 폼 돌려 놓기
    reset(watch())

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (state.code === USER_CODES.ALREADY_EXIST_NICKNAME) {
      setError('newNickname', {
        message: USER_MESSAGES.ALREADY_EXIST_NICKNAME,
      })
      return
    }
  }, [reset, setError, setValue, state, watch])

  // span으로 input의 너비 측정
  // useLayoutEffect으로 깜빡임 방지
  useLayoutEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth)
    }
  }, [newNickname, isEditing])

  // 밖에서 isEdit으로 편집 모드 종료
  useEffect(() => {
    if (isEdit === false) {
      setIsEditing(false)
      setValue('newNickname', nickname)
    }
  }, [isEdit, nickname, setValue])

  // 편집 모드 시작
  useEffect(() => {
    if (isEditing) {
      setFocus('newNickname')
    }
  }, [isEditing, setFocus])

  if (!isCurrentUser)
    return (
      <div className='relative flex h-10 items-center justify-center'>
        <p className='text-xl font-semibold'>{nickname}</p>
      </div>
    )

  return (
    <>
      {isEditing ? (
        <>
          <form action={formAction}>
            <div className='relative flex h-10 items-center justify-center'>
              <span
                ref={spanRef}
                className='invisible absolute text-xl font-semibold whitespace-pre'
                aria-hidden
              >
                {newNickname}
              </span>
              <input
                {...register('newNickname')}
                className='border-0 text-xl font-semibold outline-none'
                style={{ width: inputWidth + 6 + 'px' }}
                type='text'
                disabled={isPending}
              />
              <button
                className='profile-btn -right-9'
                type='submit'
                disabled={isPending || !isValid || !!errors.newNickname}
              >
                {isPending ? (
                  <span className='loading loading-spinner' />
                ) : (
                  <Check className='stroke-3' />
                )}
              </button>
              <button
                className='profile-btn bg-error -right-17'
                type='button'
                onClick={() => {
                  setIsEditing(false)
                  setValue('newNickname', nickname)
                }}
              >
                <X className='stroke-3' />
              </button>
            </div>
          </form>
          {errors.newNickname?.message && (
            <p className='text-error -mt-3 mb-2 text-center text-sm'>
              {errors.newNickname.message}
            </p>
          )}
        </>
      ) : (
        <div className='relative flex h-10 items-center justify-center'>
          <span className='pr-1.5 text-xl font-semibold'>{nickname}</span>
          {isEdit && (
            <button
              className='profile-btn -right-9'
              type='button'
              onClick={() => setIsEditing(true)}
            >
              <Pencil className='stroke-base-content fill-base-100 stroke-2' />
            </button>
          )}
        </div>
      )}
    </>
  )
}
