'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { updateIntroAction } from './actions'
import { Check, Pencil, X } from 'lucide-react'
import clsx from 'clsx'

export default function IntroForm({
  isCurrentUser,
  oneLineIntro,
  isEdit,
}: {
  isCurrentUser: boolean
  oneLineIntro: string
  isEdit: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [intro, setIntro] = useState(oneLineIntro)
  const [prevIntro, setPrevIntro] = useState('')
  // 닉네임은 수정 성공시 세션을 갱신 하기 때문에 리렌더링되어 이전값 상태 관리 필요 없음
  // 한 줄 소개는 세션에 포함되지 않기 때문에 수동으로 상태를 관리 필요
  // 첫 편집 시 취소하면 oneLineIntro를 그대로 복구하면 되지만,
  // 이미 한 번 수정한 이후 다시 편집을 취소할 경우에는,
  // 초기 oneLineIntro가 아니라 직전에 저장된 값을 복원해야 하므로 prevIntro로 따로 저장해둠.

  const [state, formAction, isPending] = useActionState(updateIntroAction, {
    message: '',
    intro: '',
  })

  // 수정 성공
  useEffect(() => {
    if (state.message === 'success') {
      setIntro(state.intro)
      setIsEditing(false)
      setPrevIntro(intro)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // 편집 모드 시작
  useEffect(() => {
    if (isEditing) {
      setPrevIntro(intro)
      inputRef.current?.focus()
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
        setIntro(prevIntro)
      }
    }
  }, [isEdit, prevIntro])

  if (!isCurrentUser)
    return (
      <div className='bg-base-100 w-full rounded-2xl p-4'>
        <p className={clsx('text-center', !intro && 'text-gray-500')}>
          {intro || '한 줄 소개가 없습니다.'}
        </p>
      </div>
    )

  return (
    <div className='w-full'>
      {isEditing ? (
        <form action={formAction}>
          <div className='bg-base-100 relative rounded-2xl p-4'>
            <input
              className='w-full border-none text-center outline-none'
              ref={inputRef}
              name='oneLineIntro'
              type='text'
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              maxLength={50}
              disabled={isPending}
            />
            <div>
              <button
                className='profile-btn -top-2.5 -right-2.5'
                type='submit'
                disabled={isPending}
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
                  setIntro(prevIntro)
                }}
              >
                <X className='stroke-3' />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className='bg-base-100 relative w-full rounded-2xl p-4'>
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
      {state.message !== 'success' && <>{state.message}</>}
    </div>
  )
}
