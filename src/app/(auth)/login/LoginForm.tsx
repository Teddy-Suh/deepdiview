'use client'

import { useActionState } from 'react'
import { signInWithCredentials } from './actions'

export default function LoginForm() {
  const [state, formAction] = useActionState(signInWithCredentials, { message: '' })

  return (
    <form action={formAction} className='flex flex-col'>
      <label className='form-control'>
        <span className='label-text'>이메일</span>
        <input name='email' type='email' className='input input-bordered' required />
      </label>

      <label className='form-control'>
        <span className='label-text'>비밀번호</span>
        <input name='password' type='password' className='input input-bordered' required />
      </label>

      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}

      <button type='submit' className='btn btn-primary'>
        로그인
      </button>
    </form>
  )
}
