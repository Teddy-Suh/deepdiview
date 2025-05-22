export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createBoardReviewAction } from './actions'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCertification } from '@/lib/api/certification'
import ReviewFormSection from '@/components/layout/ReviewFormSection'

export default async function BoardCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ title: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { status } = await getCertification(session?.accessToken)
  if (status !== 'APPROVED') redirect('/profile/watch-verification')

  const { title: movieTitle } = await searchParams

  return (
    <ReviewFormSection>
      <ReviewForm action={createBoardReviewAction} movieTitle={movieTitle} certified={true} />
    </ReviewFormSection>
  )
}
