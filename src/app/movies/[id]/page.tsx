export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import LatestReviewSection from './LatestReviewSection'
import OverlaidMovieHero from '@/components/ui/OverlaidMovieHero'
import { getCertification } from '@/lib/api/certification'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie } from '@/lib/api/movie'
import { notFound } from 'next/navigation'
import MyReviewSection from './MyReviewSection'
import { getReviews } from '@/lib/api/review'
import { MOVIES_CODES } from '@/constants/messages/movie'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const movie = await getMovie(id)
    return {
      title: movie.title,
    }
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === MOVIES_CODES.MOVIE_NOT_FOUND) return notFound()
    throw error
  }
}

export default async function MoviesPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session, { tmdbId }, { isSunday }] = await Promise.all([
    params,
    auth(),
    getThisWeekMovieId(),
    getIsSunday(),
  ])
  const isThisWeekMovie = Number(id) === tmdbId

  let certificationStatus = null
  if (session && !isSunday) {
    certificationStatus = (await getCertification(session.accessToken)).status
  }

  let movie
  try {
    movie = await getMovie(id, !!session, session?.accessToken)
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === MOVIES_CODES.MOVIE_NOT_FOUND) return notFound()
    throw error
  }

  const { content: reviews } = await getReviews(id, !!session, session?.accessToken, { size: 9 })

  return (
    <>
      <GoBackHeader />
      <OverlaidMovieHero movie={movie} withTitle={false} isMovieLinkActive={false} />
      <div className='space-y-8'>
        <MyReviewSection
          session={session}
          myReview={movie.myReview}
          isThisWeekMovie={isThisWeekMovie}
          isSunday={isSunday}
          certificationStatus={certificationStatus}
          movieId={id}
          movieTitle={movie.title}
        />
        <LatestReviewSection
          latestReviews={reviews}
          href={`/movies/${id}/reviews?title=${movie.title}`}
          withMovie={false}
        />
      </div>
    </>
  )
}
