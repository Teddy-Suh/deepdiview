import { auth } from '@/auth'
import ReviewList from '@/components/ui/ReviewList'
import { getLatestReviews } from '@/lib/api/review'

export default async function ReviewListWrapper() {
  const session = await auth()
  const reviews = await getLatestReviews(!!session, session?.accessToken, {
    page: 0,
    size: 12,
  })

  return (
    <ReviewList session={session} initialReviews={reviews.content} initialLast={reviews.last} />
  )
}
