'use server'

import { auth } from '@/auth'
import { toggleLike } from '../api/review'

export async function toggleLikeAction(
  reviewId: string,
  state: { likedByUser: boolean | null; likeCount: number; message: string }
) {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')
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
