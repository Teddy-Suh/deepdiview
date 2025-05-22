export const dynamic = 'force-dynamic'

import { getReview } from '@/lib/api/review'
import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import CommentSection from './CommentSection'
import { notFound } from 'next/navigation'
import { deleteReviewAction } from './actions'
import LikeButton from '@/components/ui/LikeButton'

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, { id: reviewId }] = await Promise.all([auth(), params])
  const currentUserId = session?.user?.userId.toString() || ''

  let review
  try {
    review = await getReview(reviewId, !!session, session?.accessToken)
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
          <h2>{review.reviewTitle}</h2>
          {currentUserId === review.userId.toString() && (
            <>
              <Link className='btn' href={`/reviews/${reviewId}/edit?title=${review.movieTitle}`}>
                수정
              </Link>
              {/* TODO: 삭제 전에 확인창 구현 */}
              <form action={deleteReviewAction.bind(null, reviewId)}>
                <button className='btn'>삭제</button>
              </form>
            </>
          )}
          <Link className='flex' href={`/profile/${review.userId}`}>
            {review.profileImageUrl ? (
              <Image src={`${review.profileImageUrl}`} alt='프로필 사진' width={20} height={20} />
            ) : (
              <CircleUserRound />
            )}
            <p>{review.nickname}</p>
          </Link>
          <p>별점: {review.rating}</p>
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
      <LikeButton
        likedByUser={review.likedByUser}
        likeCount={review.likeCount}
        reviewId={reviewId}
      />
      <CommentSection
        comments={review.comments}
        currentUserId={currentUserId}
        reviewId={reviewId}
      />
    </>
  )
}
