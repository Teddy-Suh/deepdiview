'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from './actions'

export default function PasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, {
    message: '',
  })

  return (
    <form action={formAction}>
      <input
        className='input input-bordered'
        placeholder='비밀번호'
        type='password'
        name='newPassword'
        required
      />
      <input
        className='input input-bordered'
        placeholder='비밀번호 확인'
        type='password'
        name='newConfirmPassword'
        required
      />
      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}
      <button className='btn' type='submit'>
        비밀번호 변경
      </button>
    </form>
  )
}
