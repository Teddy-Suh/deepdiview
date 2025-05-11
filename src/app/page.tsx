export const dynamic = 'force-dynamic'

import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import MovieCarousel from '@/components/ui/MovieCarousel'
import OverlaidMovieHero from '@/components/ui/OverlaidMovieHero'
import ReviewCarousel from '@/components/ui/ReviewCarousel'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie, getPopularMovies } from '@/lib/api/movie'
import { getLatestReviews } from '@/lib/api/review'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const [popularMovies, { isSunday }, latestReviews, { tmdbId }] = await Promise.all([
    getPopularMovies(),
    getIsSunday(),
    getLatestReviews(),
    getThisWeekMovieId(),
  ])

  const thisWeekMovie = await getMovie(tmdbId.toString())

  return (
    <>
      <BaseHeader />
      <div className='space-y-8'>
        <OverlaidMovieHero movie={thisWeekMovie} isSunday={isSunday} />

        <section className='container-wrapper'>
          <h3 className='mb-3 text-xl font-semibold'>인기 영화</h3>
          <MovieCarousel movies={popularMovies} />
        </section>

        <section className='container-wrapper'>
          <div className='flex justify-between'>
            <h3 className='mb-3 text-xl font-semibold'>최신 리뷰</h3>
            <Link className='flex' href={'/reviews'}>
              더보기
              <ChevronRight />
            </Link>
          </div>
          <ReviewCarousel reviews={latestReviews.content} />
        </section>
      </div>
    </>
  )
}
