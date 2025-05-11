import { Movie } from '@/types/api/movie'

import Image from 'next/image'
import RatingProgressChart from './RatingProgressChart'
import RatingBarChart from './RatingBarChart'
import Overview from './Overview'
import Link from 'next/link'
import clsx from 'clsx'

export default function OverlaidMovieHero({
  movie,
  withTitle = true,
  isMovieLinkActive = true,
  isSunday,
}: {
  movie: Movie
  withTitle?: boolean
  isMovieLinkActive?: boolean
  isSunday?: boolean
}) {
  return (
    <section
      className='overlaid-bg container-wrapper pt-16 pb-8'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
      }}
    >
      <div className='relative z-10'>
        {withTitle && (
          <h3 className='mb-3 text-xl font-semibold'>{isSunday ? '다음주 영화' : '이주의 영화'}</h3>
        )}
        <div className='flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-0'>
          {/* 포스터 */}
          <div className='w-full flex-2 px-16 md:pr-6 md:pl-0 lg:pr-10 lg:pl-0'>
            <div className='relative aspect-2/3 w-full'>
              <Link
                href={`/movies/${movie.id}`}
                className={clsx({ 'pointer-events-none': !isMovieLinkActive })}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt='영화 포스터'
                  fill
                  className={clsx('rounded-lg object-cover', { grayscale: !movie.available })}
                />
              </Link>
            </div>
          </div>

          {/* 정보 */}
          <div className='flex flex-5 flex-col gap-4 md:gap-8 lg:gap-14'>
            {/* 상단 텍스트 */}
            <div className='leading-tight'>
              <p className='text-3xl font-bold'>{movie.title}</p>
              <p className='text-sm text-gray-300'>{movie.original_title}</p>
              <p className='text-sm text-gray-300'>
                {movie.release_date.slice(0, 4)} · {movie.genre_names.join(' / ')}
                {movie.runtime && ` · ${movie.runtime}분`}
              </p>
            </div>

            {/* 별점 차트 */}
            <div className='flex items-center gap-4 px-4 md:gap-16 md:px-20 lg:gap-20 lg:px-24'>
              <div className='aspect-square flex-2'>
                <RatingProgressChart ratingAverage={movie.ratingStats.ratingAverage} />
              </div>
              <div className='aspect-5/2 flex-5'>
                <RatingBarChart ratingDistribution={movie.ratingStats.ratingDistribution} />
              </div>
            </div>

            {/* 줄거리 */}
            <Overview overview={movie.overview} />
          </div>
        </div>
      </div>
    </section>
  )
}
