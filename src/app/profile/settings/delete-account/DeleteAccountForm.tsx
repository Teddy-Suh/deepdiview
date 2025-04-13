'use client'

import { useActionState, useEffect } from 'react'
import { deleteMyProfileAction } from './actions'
import { signOut } from 'next-auth/react'

export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteMyProfileAction, {
    message: '',
  })

  useEffect(() => {
    if (state.message === 'success') {
      signOut({ callbackUrl: '/' })
    }
  }, [state.message])

  return (
    <form action={formAction}>
      <input
        className='input input-bordered'
        placeholder='비밀번호'
        type='password'
        name='password'
        required
      />
      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}
      <button className='btn' type='submit'>
        회원 탈퇴
      </button>
    </form>
  )
}
