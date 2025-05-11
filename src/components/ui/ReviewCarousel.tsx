'use client'

import { Review } from '@/types/api/common'
import { ChevronLeft, ChevronRight, MessageCircle, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import Rating from './Rating'
import { getRelativeTime } from '@/lib/utils/date'

export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
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
            <Link href={`/reviews/${review.reviewId}`}>
              <div className='bg-base-300 space-y-2 rounded-xl p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <Image
                        src={`${review.profileImageUrl}`}
                        alt='프로필 사진'
                        width={33}
                        height={33}
                        className='aspect-square rounded-full'
                      />
                    </div>
                    <div>
                      <p className='text-sm'>{review.nickname}</p>
                      <p className='text-xs text-gray-500'>{getRelativeTime(review.createdAt)}</p>
                    </div>
                  </div>
                  <Rating rating={review.rating} readOnly={true} />
                </div>
                <div className='flex gap-3'>
                  <div className='relative aspect-[2/3] flex-1 shrink-0'>
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                      alt='영화 포스터'
                      fill
                      className='rounded-lg object-cover'
                    />
                  </div>
                  <div className='flex-2 space-y-1 overflow-hidden'>
                    <p className='truncate overflow-hidden text-lg font-bold whitespace-nowrap'>
                      {review.reviewTitle}
                    </p>
                    <p className='line-clamp-3'>{review.reviewContent}</p>
                  </div>
                </div>
                <div className='flex justify-between gap-3'>
                  <p className='truncate overflow-hidden whitespace-nowrap'>{review.movieTitle}</p>
                  <div className='flex'>
                    <Heart />
                    <p className='mr-3'>{review.likeCount}</p>
                    <MessageCircle />
                    <p>{review.commentCount}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 왼쪽 버튼 */}
      {!isAtStart && (
        <button
          type='button'
          onClick={() => scroll('left')}
          className='btn btn-circle absolute top-1/2 -left-5 hidden !-translate-y-1/2 md:flex'
        >
          <ChevronLeft />
        </button>
      )}

      {/* 오른쪽 버튼 */}
      {!isAtEnd && (
        <button
          type='button'
          onClick={() => scroll('right')}
          className='btn btn-circle absolute top-1/2 -right-5 hidden !-translate-y-1/2 md:flex'
        >
          <ChevronRight />
        </button>
      )}
    </div>
  )
}
