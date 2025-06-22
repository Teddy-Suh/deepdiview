export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createReviewAction } from './actions'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import ReviewFormSection from '@/components/layout/ReviewFormSection'
import { getMovie } from '@/lib/api/movie'
import { MOVIES_CODES } from '@/constants/messages/movie'

export default async function MoviesReviewsCreatePage({
  params,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ title: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ id: tmdbId }, { isSunday }, { tmdbId: thisWeekMovieId }] = await Promise.all([
    params,
    getIsSunday(),
    getThisWeekMovieId(),
  ])

  let status
  if (!isSunday) {
    status = await getCertification(session.accessToken)
  } else {
    status = ''
  }

  let movie
  try {
    movie = await getMovie(tmdbId, !!session, session?.accessToken)
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === MOVIES_CODES.MOVIE_NOT_FOUND) return notFound()
    throw error
  }

  // 인증한 경우
  if (thisWeekMovieId.toString() === tmdbId && status === 'APPROVED') {
    redirect('/board/create')
  }

  const action = createReviewAction.bind(null, tmdbId)

  return (
    <ReviewFormSection>
      <ReviewForm action={action} movieTitle={movie.title} certified={false} />
    </ReviewFormSection>
  )
}
