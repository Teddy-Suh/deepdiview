export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewList from '@/components/ui/ReviewList'
import { getReviews } from '@/lib/api/review'
import { notFound } from 'next/navigation'

export default async function MoviesReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, auth()])

  let reviews
  try {
    reviews = await getReviews(id, !!session, session?.accessToken, { page: 0, size: 12 })
  } catch (error) {
    if (error instanceof Error && error.message === 'MOVIE_NOT_FOUND') {
      return notFound()
    }
    throw error
  }
  console.log(reviews)

  return (
    <>
      <GoBackHeader>
        <h2 className='text-xl font-semibold'>{reviews.content[0]?.movieTitle} 리뷰</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <h2 className='mt-4 mb-3 hidden text-xl font-semibold md:block'>
          {reviews.content[0]?.movieTitle} 리뷰
        </h2>
        <ReviewList initialReviews={reviews.content} initialLast={reviews.last} withMovie={false} />
      </div>
    </>
  )
}
