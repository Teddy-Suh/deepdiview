import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { getLatestReviews } from '@/lib/api/review'
import ReviewList from '../../components/ui/ReviewList'

export default async function ReviewsPage() {
  const session = await auth()
  const reviews = await getLatestReviews(!!session, session?.accessToken, {
    page: 0,
    size: 12,
  })

  console.log(reviews)

  return (
    <>
      <GoBackHeader>
        <h2 className='text-xl font-semibold'>최신 리뷰</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <h2 className='mt-4 mb-3 hidden text-xl font-semibold md:block'>최신 리뷰</h2>
        <ReviewList initialReviews={reviews.content} initialLast={reviews.last} />
      </div>
    </>
  )
}
