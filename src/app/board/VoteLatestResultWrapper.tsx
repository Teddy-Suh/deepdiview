import { getMovie } from '@/lib/api/movie'
import { getVoteLatestResult } from '@/lib/api/vote'
import VoteResultCard from './VoteResultCard'

export default async function VoteLatestResultWrapper() {
  const { results } = await getVoteLatestResult()
  const tmdbIds = results.map((result) => result.tmdbId)
  const movies = await Promise.all(tmdbIds.map((id) => getMovie(id.toString())))

  const voteResults = movies.map((movie, index) => {
    const result = results[index]
    return {
      ...movie,
      ...result,
    }
  })

  return <VoteResultCard voteResults={voteResults} />
}
