'use client'

import Image from 'next/image'
import React, { useActionState, useEffect, useState } from 'react'
import { participateVoteAction } from './actions'
import Link from 'next/link'
import { Movie } from '@/types/api/movie'
import { ChevronRight } from 'lucide-react'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function VoteCard({
  voteOptions,
  readOnly = false,
}: {
  voteOptions: Movie[]
  readOnly?: boolean
}) {
  const [state, formAction, isPending] = useActionState(participateVoteAction, {
    code: '',
  })
  const [selected, setSelected] = useState<number>()

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [state])

  return (
    <form action={formAction}>
      <ul className='grid grid-cols-1 gap-4 px-1 pt-6 md:grid-cols-2 lg:grid-cols-3'>
        {voteOptions.map((voteOption) => (
          <li key={voteOption.id}>
            <label>
              <input
                type='radio'
                name='tmdbId'
                value={voteOption.id}
                className='peer hidden'
                onChange={() => setSelected(voteOption.id)}
                disabled={readOnly}
              />
              <div className='bg-base-100 peer-checked:ring-primary flex gap-4 rounded-lg p-4 peer-checked:ring-2'>
                <div className='relative aspect-2/3 flex-2 overflow-hidden rounded-lg'>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${voteOption.poster_path}`}
                    alt='포스터'
                    fill
                  />
                </div>
                <div className='flex aspect-square flex-3 flex-col justify-between'>
                  <div className='space-y-1'>
                    <p className='text-lg font-semibold break-keep md:text-xl'>
                      {voteOption.title}
                    </p>
                    <p className='text-sm break-keep text-gray-400'>
                      {voteOption.release_date.slice(0, 4)} · {voteOption.genre_names.join(' / ')}
                      {!!voteOption.runtime && ` · ${voteOption.runtime}분`}
                    </p>
                  </div>
                  <div className='flex justify-end'>
                    <Link
                      className='btn btn-circle btn-sm btn-soft'
                      href={`/movies/${voteOption.id}`}
                    >
                      <ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </label>
          </li>
        ))}
        {!readOnly && (
          <li className='col-span-full text-center'>
            <button className='btn btn-primary' type='submit' disabled={!selected || isPending}>
              {isPending ? (
                <>
                  <span className='loading loading-ring' />
                </>
              ) : (
                '투표 하기'
              )}
            </button>
          </li>
        )}
      </ul>
    </form>
  )
}
