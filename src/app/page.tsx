export const dynamic = 'force-dynamic'

import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import LatestReviewSection from '@/components/ui/LatestReviewSection'
import MovieCarousel from '@/components/ui/MovieCarousel'
import OverlaidMovieHero from '@/components/ui/OverlaidMovieHero'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie, getPopularMovies } from '@/lib/api/movie'
import { getLatestReviews } from '@/lib/api/review'

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
      <OverlaidMovieHero movie={thisWeekMovie} isSunday={isSunday} />

      <div className='space-y-8'>
        <section className='container-wrapper'>
          <h3 className='mb-3 text-xl font-semibold'>인기 영화</h3>
          <MovieCarousel movies={popularMovies} />
        </section>

        <LatestReviewSection latestReviews={latestReviews.content} href='/reviews' />
      </div>
    </>
  )
}
