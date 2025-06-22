import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { getReview } from '@/lib/api/review'
import { Session } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReviewItem from '@/components/ui/ReviewItem'
import DeleteReviewButton from './DeleteReviewButton'
import { REVIEW_CODES } from '@/constants/messages/reviews'

export default async function ReviewSection({
  currentUserId,
  reviewId,
  session,
}: {
  currentUserId: string
  reviewId: string
  session: Session | null
}) {
  let review
  try {
    review = await getReview(reviewId, !!session, session?.accessToken)
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === REVIEW_CODES.REVIEW_NOT_FOUND) return notFound()
    throw error
  }

  return (
    <>
      {/* 모바일 헤더 */}
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>리뷰</h2>
        {currentUserId === review.userId.toString() && (
          <div className='flex gap-2'>
            <Link
              className='btn btn-primary'
              href={`/reviews/${reviewId}/edit?title=${review.movieTitle}`}
            >
              수정
            </Link>
            {/* TODO: 삭제 전에 확인창 구현 */}
            <DeleteReviewButton reviewId={reviewId} />
          </div>
        )}
      </GoBackHeader>

      <section className='container-wrapper md:px-24 lg:px-32'>
        {/* PC 헤더 */}
        <div className='mt-4 mb-3 hidden items-center md:flex'>
          <h2 className='flex-1 text-xl font-semibold'>리뷰</h2>
          {currentUserId === review.userId.toString() && (
            <div className='flex gap-2'>
              <Link
                className='btn btn-primary'
                href={`/reviews/${reviewId}/edit?title=${review.movieTitle}`}
              >
                수정
              </Link>
              {/* TODO: 삭제 전에 확인창 구현 */}
              <DeleteReviewButton reviewId={reviewId} />
            </div>
          )}
        </div>
        {/* 리뷰 */}
        <ReviewItem review={review} withMovie={false} isDetail />
      </section>
    </>
  )
}
