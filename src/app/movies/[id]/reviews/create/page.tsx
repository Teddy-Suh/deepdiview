export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createReviewAction } from './actions'

export default async function MoviesReviewsCreatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: tmdbId } = await params
  const action = createReviewAction.bind(null, tmdbId)
  return (
    <>
      <h2>모든 사용자가 접근 가능한 영화 리뷰 작성 페이지</h2>
      <ReviewForm action={action} />
    </>
  )
}
