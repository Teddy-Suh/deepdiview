export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createReviewAction } from './actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'
import { getThisWeekMovieId } from '@/lib/api/discussion'
import ReviewFormSection from '@/components/layout/ReviewFormSection'

export default async function MoviesReviewsCreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ title: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ title: movieTitle }, { id: tmdbId }, { status }, { tmdbId: thisWeekMovieId }] =
    await Promise.all([
      searchParams,
      params,
      getCertification(session?.accessToken),
      getThisWeekMovieId(),
    ])

  if (thisWeekMovieId.toString() === tmdbId && status === 'APPROVED') {
    redirect(`/board/create?title=${encodeURIComponent(movieTitle)}`)
  }

  const action = createReviewAction.bind(null, tmdbId)

  return (
    <ReviewFormSection>
      <ReviewForm action={action} movieTitle={movieTitle} certified={false} />
    </ReviewFormSection>
  )
}
