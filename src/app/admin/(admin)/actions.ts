'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { getMovie } from '@/lib/api/movie'
import { createVote } from '@/lib/api/vote'
import { Movie } from '@/types/api/movie'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createVoteAction = async (state: { voteOptions: Movie[]; code: string }) => {
  const session = await auth()
  if (!session) redirect('/login')

  try {
    const { tmdbIds } = await createVote(session.accessToken)
    const voteOptions = await Promise.all(tmdbIds.map((id) => getMovie(id.toString())))

    revalidatePath('/admin')
    return { ...state, voteOptions, code: COMMON_CODES.SUCCESS as string }
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
