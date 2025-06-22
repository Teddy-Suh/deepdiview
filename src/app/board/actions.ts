'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { getMovie } from '@/lib/api/movie'
import { participateVote } from '@/lib/api/vote'
import { VoteResultWithMovie } from '@/types/api/vote'
import { revalidatePath } from 'next/cache'

export const participateVoteAction = async (
  state: { voteResults: VoteResultWithMovie[]; code: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  const tmdbId = formData.get('tmdbId') as string

  try {
    const { results } = await participateVote(session.accessToken, {
      tmdbId: Number(tmdbId),
    })
    const tmdbIds = results.map((result) => result.tmdbId)
    const movies = await Promise.all(tmdbIds.map((id) => getMovie(id.toString())))
    const voteResults = movies.map((movie, index) => {
      const result = results[index]
      return {
        ...movie,
        ...result,
      }
    })
    revalidatePath('/board')
    return { ...state, voteResults, code: COMMON_CODES.SUCCESS as string }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error('UNHANDLED_ERROR')
    }
  }
}
