import { VoteResultWithMovie } from '@/types/api/vote'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function VoteResultCard({
  voteResults,
  withTitle = true,
}: {
  voteResults: VoteResultWithMovie[]
  withTitle?: boolean
}) {
  const totalVotes = voteResults.reduce((sum: number, result) => sum + result.voteCount, 0)
  return (
    <div className='bg-base-300 rounded-3xl p-4'>
      {withTitle && <p className='mb-4'>일요일엔 게시판이 쉽니다!</p>}
      <ul className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {voteResults.map((voteResult) => (
          <li key={voteResult.rank}>
            <Link href={`/movies/${voteResult.id}`}>
              <div
                className={clsx(
                  'bg-base-100 flex gap-4 rounded-3xl p-4',
                  voteResult.voted && 'ring-primary ring-2'
                )}
              >
                <div className='relative aspect-2/3 flex-2 overflow-hidden rounded-lg'>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${voteResult.poster_path}`}
                    alt='포스터'
                    fill
                  />
                </div>
                <div className='flex flex-3 flex-col justify-between'>
                  <div className='space-y-1'>
                    <p className='text-3xl font-black md:text-4xl'>{voteResult.rank}</p>
                    <p className='line-clamp-2 text-lg font-semibold break-keep md:text-xl'>
                      {voteResult.title}
                    </p>
                  </div>
                  <div>
                    <p className='text-end text-sm'>
                      {((voteResult.voteCount / totalVotes) * 100).toFixed(1)}% (
                      {voteResult.voteCount}
                      표)
                    </p>
                    <progress
                      className='progress progress-primary h-3'
                      value={voteResult.voteCount}
                      max={totalVotes}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
