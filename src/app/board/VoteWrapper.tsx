import { getVoteOptions, getVoteParticipationStatus, getVoteResult } from '@/lib/api/vote'
import { Session } from 'next-auth'
import { getMovie } from '@/lib/api/movie'
import VoteCard from './VoteCard'
import VoteToggle from './VoteToggle'
import VoteResultCard from './VoteResultCard'

export default async function VoteWrapper({ session }: { session: Session }) {
  // 투표 유무
  const { participated } = await getVoteParticipationStatus(session?.accessToken)

  // 투표 O
  // 진행 중인 투표 결과
  if (participated) {
    const { results } = await getVoteResult(session.accessToken)
    const tmdbIds = results.map((result) => result.tmdbId)
    const movies = await Promise.all(tmdbIds.map((id) => getMovie(id.toString())))
    const voteResults = movies.map((movie, index) => {
      const result = results[index]
      return {
        ...movie,
        ...result,
      }
    })

    return (
      <VoteToggle participated={participated} session={session}>
        <VoteResultCard voteResults={voteResults} withTitle={false} />
      </VoteToggle>
    )
  }

  // 투표 X
  // 투표 후보 및 투표
  const voteOptions = await getVoteOptions(session?.accessToken)
  const moviePromises = voteOptions.tmdbIds.map((id) => getMovie(id.toString()))
  const movies = await Promise.all(moviePromises)

  return (
    <VoteToggle participated={participated} session={session}>
      <VoteCard voteOptions={movies} />
    </VoteToggle>
  )
}
