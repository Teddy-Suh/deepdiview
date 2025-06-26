import { auth } from '@/auth'
import ReviewList from '@/components/ui/ReviewList'
import { MOVIES_CODES } from '@/constants/messages/movie'
import { getReviews } from '@/lib/api/review'
import { ReviewSortField } from '@/types/api/common'
import { notFound } from 'next/navigation'

export default async function ReviewListWrapper({
  id,
  sort,
}: {
  id: string
  sort: ReviewSortField
}) {
  const session = await auth()
  let reviews
  try {
    reviews = await getReviews(id, !!session, session?.accessToken, {
      page: 0,
      size: 12,
      sort: `${sort},desc`,
    })
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === MOVIES_CODES.MOVIE_NOT_FOUND) return notFound()
    throw error
  }

  return (
    <ReviewList
      session={session}
      initialReviews={reviews.content}
      initialLast={reviews.last}
      withMovie={false}
      movieId={id}
      sort={sort}
    />
  )
}
