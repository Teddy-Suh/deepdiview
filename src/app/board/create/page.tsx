export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createBoardReviewAction } from './actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'
import ReviewFormSection from '@/components/layout/ReviewFormSection'
import { getIsSunday } from '@/lib/api/discussion'
import { COMMON_CODES } from '@/constants/messages/common'
import { CERTIFICATION_STATUS } from '@/constants/certification'

export const metadata = {
  title: '리뷰 작성',
}

export default async function BoardCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ title: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { isSunday } = await getIsSunday()
  if (isSunday) throw new Error(COMMON_CODES.UNHANDLED_ERROR)

  const { status } = await getCertification(session?.accessToken)
  if (status !== CERTIFICATION_STATUS.APPROVED) redirect('/profile/watch-verification')

  const { title: movieTitle } = await searchParams

  return (
    <ReviewFormSection>
      <ReviewForm action={createBoardReviewAction} movieTitle={movieTitle} certified={true} />
    </ReviewFormSection>
  )
}
