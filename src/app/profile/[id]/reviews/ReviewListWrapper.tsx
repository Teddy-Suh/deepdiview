import ReviewList from '@/components/ui/ReviewList'
import { getUserReviews } from '@/lib/api/user'
import { ReviewSortField } from '@/types/api/common'
import { Session } from 'next-auth'

export default async function ReviewListWrapper({
  session,
  id,
  sort,
}: {
  session: Session
  id: string
  sort: ReviewSortField
}) {
  const reviews = await getUserReviews(session.accessToken, id, {
    page: 0,
    size: 12,
    sort: `${sort},desc`,
  })

  return (
    <ReviewList
      session={session}
      initialReviews={reviews.content}
      initialLast={reviews.last}
      userId={id}
      sort={sort}
      isUserReviewsPage
    />
  )
}
