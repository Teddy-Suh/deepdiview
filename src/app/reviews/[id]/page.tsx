export const dynamic = 'force-dynamic'

import { getReview } from '@/lib/api/review'
import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import CommentSection from './CommentSection'
import { notFound } from 'next/navigation'

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, { id: reviewId }] = await Promise.all([auth(), params])
  const currentUserId = session?.user?.userId.toString() || ''

  let review
  try {
    review = await getReview(reviewId, !!session, session?.accessToken)
    console.log('리뷰', review)
  } catch (error) {
    if (error instanceof Error && error.message === 'REVIEW_NOT_FOUND') {
      return notFound()
    }
    throw error
  }

  return (
    <>
      <section className='flex'>
        <div className='flex-1'>
          <Link className='flex' href={`/profile/${review.userId}`}>
            {review.profileImageUrl ? (
              <Image src={`${review.profileImageUrl}`} alt='프로필 사진' width={20} height={20} />
            ) : (
              <CircleUserRound />
            )}
            <p>{review.nickname}</p>
          </Link>
          <h2>{review.reviewTitle}</h2>
          <p>{review.reviewContent}</p>
        </div>
        <div>
          <Link href={`/movies/${review.tmdbId}`}>
            <Image
              src={`https://image.tmdb.org/t/p/original${review.posterPath}`}
              width={200}
              height={300}
              alt='포스터'
            />
            <p>{review.movieTitle}</p>
          </Link>
        </div>
      </section>
      <CommentSection
        comments={review.comments}
        currentUserId={currentUserId}
        reviewId={reviewId}
      />
    </>
  )
}
