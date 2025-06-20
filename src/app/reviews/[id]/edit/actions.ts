'use server'

import { auth } from '@/auth'
import { updateReview } from '@/lib/api/review'

export const updateReviewAction = async (
  reviewId: string,
  state: { message: string; resReviewId: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 도입 (zod)
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const rating = formData.get('rating') as string // form에서 온거라 string임

  try {
    const { reviewId: resReviewId } = await updateReview(reviewId, session.accessToken, {
      title,
      content,
      rating: Number(rating),
    })
    return { ...state, message: 'success', resReviewId: resReviewId.toString() }
  } catch (error) {
    // TODO: 에러 처리 구현 (우선 분기 처리만 해둠)
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { ...state, message: '존재하지 않는 리뷰입니다.' }
      case 'INVALID_USER':
        return { ...state, message: '작성자만 가능합니다.' }
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
