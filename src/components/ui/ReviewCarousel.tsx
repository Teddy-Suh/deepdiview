'use client'

import { Review } from '@/types/api/common'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import ReviewItem from './ReviewItem'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ReviewCarousel({
  reviews,
  withMovie = true,
}: {
  reviews: Review[]
  withMovie?: boolean
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fullPath =
    searchParams.toString().length > 0 ? `${pathname}?${searchParams.toString()}` : pathname

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setIsAtStart(container.scrollLeft === 0)
    setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 2)
  }

  const scroll = (direction: string) => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()

    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  return (
    <div className='relative'>
      {/* 캐러셀 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className='no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth lg:gap-3'
      >
        {reviews.map((review) => (
          <div
            className='w-full flex-shrink-0 snap-start md:w-[calc((100%-8px)/2)] lg:w-[calc((100%-24px)/3)]'
            key={review.reviewId}
          >
            <ReviewItem from={fullPath} review={review} withMovie={withMovie} />
          </div>
        ))}
      </div>

      {/* 왼쪽 버튼 */}
      {!isAtStart && (
        <button
          type='button'
          onClick={() => scroll('left')}
          className='btn btn-circle bg-base-300 absolute top-1/2 -left-5 hidden !-translate-y-1/2 md:flex'
        >
          <ChevronLeft />
        </button>
      )}

      {/* 오른쪽 버튼 */}
      {!isAtEnd && (
        <button
          type='button'
          onClick={() => scroll('right')}
          className='btn btn-circle bg-base-300 absolute top-1/2 -right-5 hidden !-translate-y-1/2 md:flex'
        >
          <ChevronRight />
        </button>
      )}
    </div>
  )
}
