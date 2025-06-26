export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { updateReviewAction } from './actions'
import { getReview } from '@/lib/api/review'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import ReviewFormSection from '@/components/layout/ReviewFormSection'
import { REVIEW_CODES } from '@/constants/messages/review'
import { COMMON_CODES } from '@/constants/messages/common'

export const metadata = {
  title: '리뷰 수정',
}

export default async function ReviewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id: reviewId } = await params

  let review
  try {
    review = await getReview(reviewId)
    // 내 리뷰 아님
    if (review.userId !== session.user.userId) throw new Error(COMMON_CODES.UNHANDLED_ERROR)
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === REVIEW_CODES.REVIEW_NOT_FOUND) return notFound()
    throw error
  }

  const action = updateReviewAction.bind(null, reviewId)

  return (
    <ReviewFormSection>
      <ReviewForm
        action={action}
        movieTitle={review.movieTitle}
        initialValue={{
          title: review.reviewTitle,
          content: review.reviewContent,
          rating: review.rating,
        }}
        certified={review.certified}
      />
    </ReviewFormSection>
  )
}
