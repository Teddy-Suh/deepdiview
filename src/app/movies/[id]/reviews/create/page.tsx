export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createReviewAction } from './actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'
import { getThisWeekMovieId } from '@/lib/api/discussion'

export default async function MoviesReviewsCreatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ status }, { tmdbId: thisWeekMovieId }, { id: tmdbId }] = await Promise.all([
    getCertification(session?.accessToken),
    getThisWeekMovieId(),
    params,
  ])

  if (thisWeekMovieId.toString() === tmdbId && status === 'APPROVED') redirect('/board/create')

  const action = createReviewAction.bind(null, tmdbId)

  return (
    <>
      <h2>모든 사용자가 접근 가능한 영화 리뷰 작성 페이지</h2>
      <ReviewForm action={action} />
    </>
  )
}
