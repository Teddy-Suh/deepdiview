export const dynamic = 'force-dynamic'

import ReviewForm from '@/components/form/ReviewForm'
import { createBoardReviewAction } from './actions'

export default function BoardCreatePage() {
  return (
    <>
      <h2>시청 인증된 사람만 접근할 수 있는 이주의 영화 리뷰 작성 페이지</h2>
      <ReviewForm action={createBoardReviewAction} />
    </>
  )
}
