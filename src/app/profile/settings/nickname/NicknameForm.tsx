'use client'

import { useActionState } from 'react'
import { updateNicknameAction } from './actions'
// import { useSession } from 'next-auth/react'

export default function NicknameForm({ nickname }: { nickname: string }) {
  // const { data: session } = useSession()

  const [state, formAction] = useActionState(updateNicknameAction, {
    message: '',
  })

  return (
    <form action={formAction}>
      <input
        className='input input-bordered'
        placeholder='닉네임을 입력해주세요'
        name='newNickname'
        type='text'
        defaultValue={nickname}
        required
      />
      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}
      <button className='btn' type='submit'>
        닉네임 변경하기
      </button>
    </form>
  )
}
