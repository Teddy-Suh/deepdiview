export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { updateReviewAction } from './actions'
import { getReview } from '@/lib/api/review'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ReviewFormSection from '@/components/layout/ReviewFormSection'

export default async function ReviewsEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ title: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ id: reviewId }, { title: movieTitle }] = await Promise.all([params, searchParams])

  const review = await getReview(reviewId)
  const action = updateReviewAction.bind(null, reviewId)

  return (
    <ReviewFormSection>
      <ReviewForm
        action={action}
        movieTitle={movieTitle}
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
