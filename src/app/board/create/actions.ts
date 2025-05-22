'use server'

import { auth } from '@/auth'
import { createBoardReview } from '@/lib/api/discussion'

export const createBoardReviewAction = async (
  state: { message: string; responseReviewId: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 도입 (zod)
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const rating = formData.get('rating') as string // form에서 온거라 string임

  try {
    const { reviewId: responseReviewId } = await createBoardReview(session.accessToken, {
      title,
      content,
      rating: Number(rating),
    })
    return { ...state, message: 'success', responseReviewId: responseReviewId.toString() }
  } catch (error) {
    // TODO: 에러 처리 구현 (우선 분기 처리만 해둠)
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'NOT_CERTIFIED_YET':
        return { ...state, message: '토론 작성 권한이 없습니다. 인증을 먼저 완료해주세요' }
      case 'MOVIE_NOT_FOUND':
        return { ...state, message: '존재하지 않는 영화입니다.' }
      case 'INVALID_REVIEW_PERIOD':
        return { ...state, message: '토론 작성 기간이 아닙니다. 다음 주에 새로운 영화로 만나요' }
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
