'use client'

import { useActionState, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { updateNicknameAction } from './actions'
import { Check, Pencil, X } from 'lucide-react'

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
  const [inputValue, setInputValue] = useState(nickname)
  const [inputWidth, setInputWidth] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const [state, formAction, isPending] = useActionState(updateNicknameAction, {
    message: '',
    nickname: '',
  })

  // 닉네임 수정 성공 시
  useEffect(() => {
    if (state.message === 'success') {
      setInputValue(state.nickname)
      setIsEditing(false)
    }
  }, [state])

  // span으로 input의 너비 측정
  // useLayoutEffect으로 깜빡임 방지
  useLayoutEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth)
    }
  }, [inputValue, isEditing])

  // 밖에서 isEdit으로 편집 모드 종료
  useEffect(() => {
    if (isEdit === false) {
      setIsEditing(false)
      setInputValue(nickname)
    }
  }, [isEdit, nickname])

  // 편집 모드 시작
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  if (!isCurrentUser)
    return (
      <div className='relative flex h-10 items-center justify-center'>
        <p className='text-xl font-semibold'>{inputValue}</p>
      </div>
    )

  return (
    <>
      {isEditing ? (
        <form action={formAction}>
          <div className='relative flex h-10 items-center justify-center'>
            <span
              ref={spanRef}
              className='invisible absolute text-xl font-semibold whitespace-pre'
              aria-hidden
            >
              {inputValue}
            </span>
            <input
              className='border-0 text-xl font-semibold outline-none'
              name='newNickname'
              type='text'
              value={inputValue}
              ref={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
              style={{ width: inputWidth + 6 + 'px' }}
              required
              minLength={2}
              maxLength={10}
              disabled={isPending}
            />
            <button className='profile-btn -right-9' type='submit' disabled={isPending}>
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
                setInputValue(nickname)
              }}
            >
              <X className='stroke-3' />
            </button>
          </div>
        </form>
      ) : (
        <div className='relative flex h-10 items-center justify-center'>
          <span className='pr-1.5 text-xl font-semibold'>{inputValue}</span>
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
      {state.message !== 'success' && <>{state.message}</>}
    </>
  )
}
