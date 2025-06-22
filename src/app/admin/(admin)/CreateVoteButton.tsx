'use client'

import { useActionState, useEffect, useState } from 'react'
import { createVoteAction } from './actions'
import VoteCard from '../../board/VoteCard'
import { Movie } from '@/types/api/movie'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function CreateVoteButton() {
  const [isCreated, setIsCreated] = useState(false)
  const [voteOptions, setVoteOptions] = useState<Movie[]>([])
  const [state, formAction, isPending] = useActionState(createVoteAction, {
    voteOptions: [],
    code: '',
  })

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.SUCCESS) {
      setVoteOptions(state.voteOptions)
      setIsCreated(true)
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [state])

  return (
    <>
      {isCreated ? (
        <VoteCard voteOptions={voteOptions} readOnly />
      ) : (
        <form action={formAction}>
          <button className='btn btn-primary' disabled={isPending}>
            {isPending ? <span className='loading loading-ring' /> : '투표 생성'}
          </button>
        </form>
      )}
    </>
  )
}
