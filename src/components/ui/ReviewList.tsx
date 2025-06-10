'use client'

import { useEffect, useRef, useState } from 'react'
import ReviewItem from '@/components/ui/ReviewItem'
import { getLatestReviews, getReviews } from '@/lib/api/review'
import type { Review, ReviewSortField } from '@/types/api/common'
import { Session } from 'next-auth'
import { getUserComments, getUserReviews } from '@/lib/api/user'
import { ReviewWithComment } from '@/types/api/user'

export default function ReviewList({
  session,
  initialReviews,
  initialLast,
  withMovie = true,
  withComment = false,
  isUserReviewsPage = false,
  movieId,
  userId,
  sort,
  certifiedFilter = false,
}: {
  session: Session | null
  initialReviews: Review[] | ReviewWithComment[]
  initialLast: boolean
  withMovie?: boolean
  withComment?: boolean
  isUserReviewsPage?: boolean
  movieId?: string
  userId?: string
  sort?: ReviewSortField
  certifiedFilter?: boolean
}) {
  const [reviews, setReviews] = useState<Review[] | ReviewWithComment[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState<boolean>()
  const [isFetching, setIsFetching] = useState(false)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    setReviews(initialReviews)
    setPage(1)
    setHasMore(!initialLast)
  }, [initialLast, initialReviews])

  useEffect(() => {
    const target = loaderRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          setIsFetching(true)

          let res

          // 튿정 사용자가 작성한 댓글 페이지
          if (withComment && session && userId) {
            const userComments = await getUserComments(session.accessToken, userId, {
              page,
              size: 12,
            })

            const reviewWithCommentsList = userComments.content.map((item) => {
              const { review, ...commentFields } = item

              const comment = {
                ...commentFields,
              }

              const reviewWithComment = {
                ...review,
                comment,
              }

              return reviewWithComment
            })

            res = {
              ...userComments,
              content: reviewWithCommentsList,
            }
          }
          // 특정 영화의 리뷰 페이지
          else if (movieId && sort) {
            res = await getReviews(movieId, !!session, session?.accessToken, {
              certifiedFilter,
              page,
              size: 12,
              sort: `${sort},desc`,
            })
          }
          // 특정 사용자가 작성한 리뷰 페이지
          else if (userId && sort && session) {
            console.log('내가쓴 리뷰')
            res = await getUserReviews(session.accessToken, userId, {
              page,
              size: 12,
              sort: `${sort},desc`,
            })
          }
          // 최신 리뷰 페이지
          else {
            res = await getLatestReviews(!!session, session?.accessToken, { page, size: 12 })
          }

          setReviews((prev) => [...prev, ...res.content] as typeof prev)
          setPage((prev) => prev + 1)
          if (res.last) setHasMore(false)

          setIsFetching(false)
          isFetchingRef.current = false
        }
      },
      {
        threshold: 0.3,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [page, hasMore, movieId, sort, session, certifiedFilter, userId, withComment])

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {reviews.map((review) => (
          <ReviewItem
            key={withComment && 'comment' in review ? review.comment.id : review.reviewId}
            review={review}
            withMovie={withMovie}
            withComment={withComment}
            isUserReviewsPage={isUserReviewsPage}
          />
        ))}
      </div>
      {isFetching && (
        <div className='mt-2 w-full text-center md:mt-3'>
          <span className='loading loading-ring loading-xl text-primary' />
        </div>
      )}
      {hasMore && <div ref={loaderRef} className='h-1 w-full opacity-0' />}
    </>
  )
}
