export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createBoardReviewAction } from './actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'

export default async function BoardCreatePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { status } = await getCertification(session?.accessToken)
  if (status !== 'APPROVED') redirect('/profile/watch-verification')

  return (
    <>
      <h2>시청 인증된 사람만 접근할 수 있는 이주의 영화 리뷰 작성 페이지</h2>
      <ReviewForm action={createBoardReviewAction} />
    </>
  )
}
