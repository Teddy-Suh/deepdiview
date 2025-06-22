'use server'

import { auth } from '@/auth'
import { toggleLike } from '../api/review'
import { COMMON_CODES } from '@/constants/messages/common'
import { REVIEW_CODES } from '@/constants/messages/reviews'
import { redirect } from 'next/navigation'

export async function toggleLikeAction(
  reviewId: string,
  state: { likedByUser: boolean | null; likeCount: number; code: string }
) {
  const session = await auth()
  if (!session) redirect('/login')
  try {
    await toggleLike(reviewId, session.accessToken)
    return {
      ...state,
      likedByUser: !state.likedByUser,
      likeCount: state.likedByUser ? state.likeCount - 1 : state.likeCount + 1,
    }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.REVIEW_NOT_FOUND:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
