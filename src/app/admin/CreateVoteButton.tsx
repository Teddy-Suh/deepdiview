'use client'

import { useActionState, useEffect, useState } from 'react'
import { createVoteAction } from './actions'
import VoteCard from '../board/VoteCard'
import { Movie } from '@/types/api/movie'

export default function CreateVoteButton() {
  const [isCreated, setIsCreated] = useState(false)
  const [voteOptions, setVoteOptions] = useState<Movie[]>([])
  const [state, formAction, isPending] = useActionState(createVoteAction, {
    voteOptions: [],
    message: '',
  })

  useEffect(() => {
    if (state.message === 'success') {
      setVoteOptions(state.voteOptions)
      setIsCreated(true)
    }
  }, [state.message, state.voteOptions])

  return (
    <>
      {isCreated ? (
        <VoteCard voteOptions={voteOptions} readOnly />
      ) : (
        <form action={formAction}>
          <button className='btn btn-primary' disabled={isPending}>
            {isPending ? <span className='loading loading-ring' /> : '투표 생성'}
          </button>
          {state.message !== 'success' && <>{state.message}</>}
        </form>
      )}
    </>
  )
}
