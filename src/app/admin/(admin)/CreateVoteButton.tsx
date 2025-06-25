'use client'

import { useActionState, useEffect } from 'react'
import { createVoteAction } from './actions'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function CreateVoteButton() {
  const [state, formAction, isPending] = useActionState(createVoteAction, {
    code: '',
  })

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [state])

  return (
    <form action={formAction}>
      <button className='btn btn-primary' disabled={isPending}>
        {isPending ? <span className='loading loading-ring' /> : '투표 생성'}
      </button>
    </form>
  )
}
