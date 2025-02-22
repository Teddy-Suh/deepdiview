'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

export default function MovieCarousel({ movies }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setIsAtStart(container.scrollLeft === 0)
    setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth)
  }

  const scroll = (direction) => {
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
      <div ref={scrollContainerRef} className='scrollbar-none flex overflow-x-auto scroll-smooth'>
        {movies.map((movie, index) => (
          <div key={index} className='w-1/3 flex-shrink-0 px-1 md:w-1/4 md:px-2 lg:w-1/5 lg:px-3'>
            <Link href={`/movie/${movie.id}`}>
              <div className='relative aspect-[2/3] w-full'>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  fill
                  alt='포스터'
                  unoptimized
                  className='rounded-lg object-cover'
                />
              </div>
              <div className='mt-2 text-sm font-medium'>{movie.title}</div>
            </Link>
          </div>
        ))}
      </div>

      {!isAtStart && (
        <button
          type='button'
          onClick={() => scroll('left')}
          className='btn btn-circle absolute bottom-1/2 left-0 hidden md:flex'
        >
          <ChevronLeft />
        </button>
      )}

      {!isAtEnd && (
        <button
          type='button'
          onClick={() => scroll('right')}
          className='btn btn-circle absolute right-0 bottom-1/2 hidden md:flex'
        >
          <ChevronRight />
        </button>
      )}
    </div>
  )
}
