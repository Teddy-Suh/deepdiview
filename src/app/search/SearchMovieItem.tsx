import { Movie } from '@/types/api/movie'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function SearchMovieItem({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`}>
      <div className='flex h-40 gap-4'>
        <div className='relative aspect-2/3'>
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt='영화 포스터'
            fill
            className={clsx('rounded-md', !movie.available && 'grayscale')}
          />
        </div>
        <div className='line-clamp-3 flex w-full flex-col justify-between'>
          <div className='space-y-0.5'>
            <p className='text-md font-semibold md:text-lg md:font-bold'>{movie.title}</p>
            <p className='md:text-md text-sm'>
              {movie.release_date.slice(0, 4)} · {movie.genre_names.join(' / ')}
              {movie.runtime && ` · ${movie.runtime}분`}
            </p>
          </div>
          <p className='text-md line-clamp-3 text-justify'>{movie.overview}</p>
        </div>
      </div>
    </Link>
  )
}
