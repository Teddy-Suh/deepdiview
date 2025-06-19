'use server'

import { auth } from '@/auth'
import { getMovie } from '@/lib/api/movie'
import { participateVote } from '@/lib/api/vote'
import { VoteResultWithMovie } from '@/types/api/vote'
import { revalidatePath } from 'next/cache'

export const participateVoteAction = async (
  state: { voteResults: VoteResultWithMovie[]; message: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 (zod)
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
    return { ...state, voteResults, message: 'success' }
  } catch (error) {
    // TODO: 에러 처리 구현 (우선 분기 처리만 해둠)
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'INVALID_VOTE_PERIOD':
        throw error
      case 'ALREADY_VOTED':
        throw error
      case 'MOVIE_NOT_FOUND_IN_VOTE':
        throw error
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}
