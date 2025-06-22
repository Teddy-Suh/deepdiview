'use client'

import { Movie } from '@/types/api/movie'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
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
        className='no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth md:gap-4'
      >
        {movies.map((movie, i) => (
          <div
            key={movie.id}
            className='w-[calc((100%-16px)/3)] shrink-0 snap-start md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)]'
          >
            <Link href={`/movies/${movie.id}`}>
              <div className='relative aspect-2/3 w-full'>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  fill
                  alt='포스터'
                  unoptimized
                  className='rounded-lg object-cover'
                />
                <div className='badge badge-ghost absolute top-2 right-2'>{i + 1}</div>
              </div>
              <p className='mt-2 text-center font-semibold'>{movie.title}</p>
            </Link>
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
