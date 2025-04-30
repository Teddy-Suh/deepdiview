export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getReviews } from '@/lib/api/review'
import { CircleCheck, CircleUserRound, MessageCircle, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MoviesReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  // TODO: 페이지네이션, 무한 스크롤, 정렬
  let reviews
  try {
    reviews = await getReviews(id, !!session, session?.accessToken, { page: 0 })
  } catch (error) {
    if (error instanceof Error && error.message === 'MOVIE_NOT_FOUND') {
      return notFound()
    }
    throw error
  }
  console.log(reviews)

  return (
    <>
      <h2>리뷰</h2>
      <hr />
      <ul>
        {reviews.content.map((review) => (
          <li key={review.reviewId}>
            <div className='flex justify-between'>
              <Link className='flex' href={`/profile/${review.userId}`}>
                {review.profileImageUrl ? (
                  <Image
                    src={`${review.profileImageUrl}`}
                    alt='프로필 사진'
                    width={20}
                    height={20}
                  />
                ) : (
                  <CircleUserRound />
                )}
                <p>{review.nickname}</p>
                {review.certified && <CircleCheck />}
              </Link>
              <p>{review.rating}</p>
            </div>
            <Link href={`/reviews/${review.reviewId}`}>
              <div>
                <p>{review.reviewTitle}</p>
                <p>{review.reviewContent}</p>
              </div>
              <div className='flex'>
                <ThumbsUp />
                {review.likeCount}
                <MessageCircle />
                {review.commentCount}
              </div>
            </Link>
            <hr />
          </li>
        ))}
      </ul>
    </>
  )
}
