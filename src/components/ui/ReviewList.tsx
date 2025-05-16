'use client'

import { useEffect, useRef, useState } from 'react'
import ReviewItem from '@/components/ui/ReviewItem'
import { getLatestReviews } from '@/lib/api/review'
import type { Review } from '@/types/api/common'

export default function ReviewList({
  initialReviews,
  initialLast,
}: {
  initialReviews: Review[]
  initialLast: boolean
}) {
  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(!initialLast)
  const [isFetching, setIsFetching] = useState(false)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    const target = loaderRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          setIsFetching(true)

          const res = await getLatestReviews(false, undefined, { page, size: 12 })
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
  }, [page, hasMore])

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {reviews.map((review) => (
          <ReviewItem key={review.reviewId} review={review} />
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
