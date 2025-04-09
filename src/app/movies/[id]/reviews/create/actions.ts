'use server'

import { auth } from '@/auth'
import { createReview } from '@/lib/api/review'
import { redirect } from 'next/navigation'

export const createReviewAction = async (tmdbId: string, formData: FormData) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 도입 (zod)
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const rating = formData.get('rating') as string // form에서 온거라 string임

  let data
  try {
    data = await createReview(session.accessToken, {
      tmdbId: Number(tmdbId),
      title,
      content,
      rating: Number(rating),
    })
  } catch (error) {
    // TODO: 에러 처리 구현 (우선 분기 처리만 해둠)
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'MOVIE_NOT_FOUND':
        throw error
      case 'ALREADY_COMMITTED_REVIEW':
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
  redirect(`/reviews/${data.reviewId}`)
}
