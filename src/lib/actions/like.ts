'use server'

import { auth } from '@/auth'
import { toggleLike } from '../api/review'
import { COMMON_CODES } from '@/constants/messages/common'
import { REVIEW_CODES } from '@/constants/messages/review'
import { redirect } from 'next/navigation'

export async function toggleLikeAction(likedByUser: boolean | null, reviewId: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  const session = await auth()
  if (!session) redirect('/login')
  try {
    await toggleLike(reviewId, session.accessToken)
    return { code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.REVIEW_NOT_FOUND:
        return { code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
