export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { updateReviewAction } from './actions'
import { getReview } from '@/lib/api/review'

export default async function ReviewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: reviewId } = await params
  const review = await getReview(reviewId)

  const action = updateReviewAction.bind(null, reviewId)

  return (
    <>
      <h2>리뷰 수정 페이지</h2>
      <ReviewForm
        action={action}
        initialValue={{
          title: review.reviewTitle,
          content: review.reviewContent,
          rating: review.rating,
        }}
      />
    </>
  )
}
