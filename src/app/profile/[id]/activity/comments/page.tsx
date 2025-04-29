export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getReview } from '@/lib/api/review'
import { getUserComments } from '@/lib/api/user'
import { Review } from '@/types/api/common'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// TODO: 페이지네이션 무한스크롤
export default async function UserCommentsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const data = await getUserComments(session.accessToken, id)

  const uniqueReviewIds = [...new Set(data.content.map((c) => c.reviewId))]
  const reviewMap = new Map<number, Review>()
  await Promise.all(
    uniqueReviewIds.map((id) =>
      getReview(id.toString()).then((review) => {
        reviewMap.set(id, review)
      })
    )
  )
  const comments = data.content.map((comment) => ({
    ...comment,
    review: reviewMap.get(comment.reviewId),
  }))

  return (
    <>
      <h2>특정 유저가 작성한 댓글 목록 페이지</h2>
      <ul>
        {comments.map((comment) => (
          <li className='mb-6 border-2 p-2 pb-0' key={comment.id}>
            <Link href={`/reviews/${comment.reviewId}`}>
              <p>댓글 작성일: {comment.createdAt}</p>
              <p>댓글: {comment.content}</p>
              <div className='m-4 border-2 p-2'>
                <p>게시글 작성일:{comment.review?.createdAt}</p>
                <div className='flex'>
                  <div>
                    <Image
                      src={`https://image.tmdb.org/t/p/original${comment.review?.posterPath}`}
                      alt='영화 포스터'
                      width={100}
                      height={150}
                    />
                    <p>{comment.review?.movieTitle}</p>
                  </div>
                  <div>
                    <p>작성자: {comment.review?.nickname}</p>
                    <p>별점: {comment.review?.rating}</p>
                    <p>제목: {comment.review?.reviewTitle}</p>
                    <p>내용: {comment.review?.reviewContent}</p>
                    <p>
                      좋아요 {comment.review?.likeCount} 댓글 {comment.review?.commentCount}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
