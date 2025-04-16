'use client'

import { useActionState } from 'react'
import { createVoteAction } from './actions'

export default function CreateVoteFom() {
  const [state, formAction] = useActionState(createVoteAction, { message: '' })

  return (
    <form action={formAction}>
      <button className='btn'>투표 생성</button>
      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>메세지창</p>
          <p>{state.message}</p>
        </div>
      )}
    </form>
  )
}
