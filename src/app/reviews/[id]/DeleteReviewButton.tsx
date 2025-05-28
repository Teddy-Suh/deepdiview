'use client'

import { useActionState, useEffect } from 'react'
import { deleteReviewAction } from './actions'
import { useRouter } from 'next/navigation'

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [state, formAction, isPending] = useActionState<{
    success: boolean | null
    message: string
  }>(deleteReviewAction.bind(null, reviewId), {
    success: null,
    message: '',
  })
  const router = useRouter()

  useEffect(() => {
    // TODO: 삭제 후 알맞은 곳으로 리디렉션하기
    // 게시판, 영화 상세 정보 페이지, 내가 쓴 리뷰 목록 등 여러 곳에서 리뷰에 접근 할 수 있기 때문에
    // searchParams에 from을 넣는 것도 고려
    if (state.success) router.replace('/')
  })
  return (
    <>
      <form action={formAction}>
        <button className='btn btn-secondary rounded-xl' type='submit' disabled={isPending}>
          {isPending ? <span className='loading loading-ring' /> : '삭제'}
        </button>
      </form>
      {state.message !== '' && <p>{state.message}</p>}
    </>
  )
}
