export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { Suspense } from 'react'
import CommentSection from './CommentSection'
import ReviewSection from './ReviewSection'
import ReviewSectionLoading from './ReviewSectionLoading'

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, { id: reviewId }] = await Promise.all([auth(), params])
  const currentUserId = session?.user?.userId.toString() || ''

  return (
    <>
      {/* 리뷰 헤더 & 섹션 */}
      {/* 헤더에서 review가 필요하므로 같이 로당 처리 */}
      <Suspense fallback={<ReviewSectionLoading />}>
        <ReviewSection currentUserId={currentUserId} reviewId={reviewId} session={session} />
      </Suspense>
      {/* 댓글 섹션 */}
      <CommentSection reviewId={reviewId} currentUserId={currentUserId} />
    </>
  )
}
