'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateIntroAction } from './actions'

export default function IntroForm({
  isCurrentUser,
  oneLineIntro,
}: {
  isCurrentUser: boolean
  oneLineIntro: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(oneLineIntro)

  const [state, formAction] = useActionState(updateIntroAction, {
    message: '',
    intro: '',
  })

  useEffect(() => {
    if (state.message === 'success') {
      setInputValue(state.intro)
      setIsEditing(false)
    }
  }, [state])

  return (
    <>
      <label>한줄소개:</label>
      {isCurrentUser ? (
        isEditing ? (
          <form action={formAction}>
            <input
              name='oneLineIntro'
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {state.message !== 'success' && <p className='text-sm text-red-500'>{state.message}</p>}
            <button className='btn' type='submit'>
              저장
            </button>
          </form>
        ) : (
          <>
            <p>{inputValue}</p>
            <button className='btn' type='button' onClick={() => setIsEditing(true)}>
              수정
            </button>
          </>
        )
      ) : (
        <p>{inputValue}</p>
      )}
    </>
  )
}
