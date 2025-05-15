import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewItem from '@/components/ui/ReviewItem'
import { getLatestReviews } from '@/lib/api/review'

export default async function ReviewsPage() {
  const session = await auth()
  const reviews = await getLatestReviews(!!session, session?.accessToken, {
    page: 0,
    size: 12,
  })

  return (
    <>
      <GoBackHeader>
        <h2 className='text-xl font-semibold'>최신 리뷰</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <h2 className='mt-4 mb-3 hidden text-xl font-semibold md:block'>최신 리뷰</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {reviews.content.map((review) => (
            <ReviewItem key={review.reviewId} review={review} />
          ))}
        </div>
      </div>
    </>
  )
}
