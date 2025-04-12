'use client'

import { useActionState } from 'react'
import { registerAction } from './actions'

export default function RegisterForm() {
  // TODO: 유효성 검사 에러났을때 폼 상태 유지하기 구현 (useState() 도입 고려 중)
  const [state, formAction] = useActionState(registerAction, { message: '' })

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

      <label className='form-control'>
        <span className='label-text'>비밀번호 확인</span>
        <input name='confirmPassword' type='password' className='input input-bordered' required />
      </label>

      <label className='form-control'>
        <span className='label-text'>닉네임</span>
        <input name='nickname' type='text' className='input input-bordered' required />
      </label>

      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}

      <button type='submit' className='btn btn-primary'>
        회원가입
      </button>
    </form>
  )
}
