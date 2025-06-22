'use client'

import { useFormStatus } from 'react-dom'

export default function LogoutButton() {
  const { pending } = useFormStatus()

  return (
    <button className='btn btn-secondary btn-soft w-full' disabled={pending} type='submit'>
      {pending ? <span className='loading loading-ring' /> : '로그아웃'}
    </button>
  )
}
