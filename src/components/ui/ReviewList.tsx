'use client'

import { useEffect, useRef, useState } from 'react'
import ReviewItem from '@/components/ui/ReviewItem'
import { getLatestReviews, getReviews } from '@/lib/api/review'
import type { Review, ReviewSortField } from '@/types/api/common'
import { Session } from 'next-auth'

export default function ReviewList({
  session,
  initialReviews,
  initialLast,
  withMovie = true,
  movieId,
  sort,
  certifiedFilter = false,
}: {
  session: Session | null
  initialReviews: Review[]
  initialLast: boolean
  withMovie?: boolean
  movieId?: string
  sort?: ReviewSortField
  certifiedFilter?: boolean
}) {
  const [reviews, setReviews] = useState<Review[]>([])
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
          if (movieId && sort) {
            res = await getReviews(movieId, !!session, session?.accessToken, {
              certifiedFilter,
              page,
              size: 12,
              sort: `${sort},desc`,
            })
          } else {
            res = await getLatestReviews(!!session, session?.accessToken, { page, size: 12 })
          }

          setReviews((prev) => [...prev, ...res.content])
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
  }, [page, hasMore, movieId, sort, session, certifiedFilter])

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {reviews.map((review) => (
          <ReviewItem key={review.reviewId} review={review} withMovie={withMovie} />
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
