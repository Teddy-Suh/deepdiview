export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getUserReviews } from '@/lib/api/user'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// TODO: 페이지네이션 무한스크롤
export default async function UserReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const data = await getUserReviews(session.accessToken, id)
  const reviews = data.content

  return (
    <>
      <h2>특정 유저가 작성한 리뷰 목록 페이지</h2>
      <ul>
        {reviews.map((review) => (
          <li className='border-2' key={review.reviewId}>
            <Link className='flex' href={`/reviews/${review.reviewId}`}>
              <div>
                <Image
                  src={`https://image.tmdb.org/t/p/original${review.posterPath}`}
                  alt='영화 포스터'
                  width={100}
                  height={150}
                />
                <p>{review.movieTitle}</p>
              </div>
              <div>
                <p>별점: {review.rating}</p>
                <p>제목: {review.reviewTitle}</p>
                <p>내용: {review.reviewContent}</p>
                <p>{review.createdAt}</p>
                <p>
                  좋아요 {review.likeCount} 댓글 {review.commentCount}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
