import { getVoteOptions } from '@/lib/api/vote'
import { getMovie } from '@/lib/api/movie'
import { Session } from 'next-auth'
import CreateVoteButton from './CreateVoteButton'
import VoteCard from '@/app/board/VoteCard'

export default async function CreateVoteWrapper({ session }: { session: Session }) {
  const { tmdbIds } = await getVoteOptions(session.accessToken)

  if (tmdbIds.length === 0)
    return (
      <div className='bg-base-300 flex flex-col items-center gap-4 rounded-3xl p-4 md:flex-row md:justify-between md:gap-0'>
        <p>투표를 생성해 주세요.</p>
        <CreateVoteButton />
      </div>
    )

  const movies = await Promise.all(tmdbIds.map((id) => getMovie(id.toString())))
  return (
    <div className='bg-base-300 flex flex-col items-center gap-4 rounded-3xl p-4 md:flex-row md:justify-between md:gap-0'>
      <div className='w-full'>
        <p className='mt-2 text-center md:text-start'>투표를 이미 생성했습니다.</p>
        <VoteCard voteOptions={movies} readOnly />
      </div>
    </div>
  )
}
