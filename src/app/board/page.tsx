export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import OverlaidMovieHero from '@/components/ui/OverlaidMovieHero'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie } from '@/lib/api/movie'
import { Suspense } from 'react'
import LatestReviewSection from './LatestReviewSection'
import ReviewCarouselLoading from '../../components/ui/ReviewCarouselLoading'
import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import VoteSection from './VoteSection'
import MyReviewSection from './MyReviewSection'

export default async function BoardPage() {
  const [session, { isSunday }, { tmdbId }] = await Promise.all([
    auth(),
    getIsSunday(),
    getThisWeekMovieId(),
  ])

  const movieId = tmdbId.toString()
  const thisWeekMovie = await getMovie(movieId, !!session, session?.accessToken)

  return (
    <>
      <BaseHeader />
      <OverlaidMovieHero movie={thisWeekMovie} isSunday={isSunday} />
      <div className='space-y-8'>
        <VoteSection isSunday={isSunday} session={session} />
        <MyReviewSection
          isSunday={isSunday}
          session={session}
          movieId={movieId}
          movieTitle={thisWeekMovie.title}
          myReview={thisWeekMovie.myReview}
        />
        {/* 최신 리뷰 유무로 제목 옆에 더보기 버튼 유무를 결정하기 때문에 이것만 다르게 컴포넌트화 함 */}
        {!isSunday && (
          <>
            <Suspense fallback={<ReviewCarouselLoading />}>
              <LatestReviewSection session={session} movieId={movieId} />
            </Suspense>
          </>
        )}
      </div>
    </>
  )
}
