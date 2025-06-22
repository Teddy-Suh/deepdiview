export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import LatestReviewSection from '@/components/ui/LatestReviewSection'
import MovieCarouselLoading from '@/components/ui/MovieCarouselLoading'
import OverlaidMovieHeroLoading from '@/components/ui/OverlaidMovieHeroLoading'
import OverlaidMovieHeroWrapper from '@/components/ui/OverlaidMovieHeroWrapper'
import PopularMovieWrapper from '@/components/ui/PopularMovieWrapper'
import ReviewCarouselLoading from '@/components/ui/ReviewCarouselLoading'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { Suspense } from 'react'

export default async function HomePage() {
  const [session, { isSunday }, { tmdbId }] = await Promise.all([
    auth(),
    getIsSunday(),
    getThisWeekMovieId(),
  ])

  return (
    <>
      <BaseHeader />
      <Suspense fallback={<OverlaidMovieHeroLoading isSunday={isSunday} />}>
        <OverlaidMovieHeroWrapper movieId={tmdbId.toString()} isSunday={isSunday} />
      </Suspense>

      <div className='space-y-8'>
        <section className='container-wrapper'>
          <h3 className='mb-3 text-xl font-semibold'>인기 영화</h3>
          <Suspense fallback={<MovieCarouselLoading />}>
            <PopularMovieWrapper />
          </Suspense>
        </section>

        <Suspense fallback={<ReviewCarouselLoading />}>
          <LatestReviewSection session={session} href='/reviews' />
        </Suspense>
      </div>
    </>
  )
}
