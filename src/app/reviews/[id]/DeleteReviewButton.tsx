'use client'

import { useActionState, useEffect } from 'react'
import { deleteReviewAction } from './actions'
import { useRouter } from 'next/navigation'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [state, formAction, isPending] = useActionState<{
    code: string
  }>(deleteReviewAction.bind(null, reviewId), {
    code: '',
  })
  const router = useRouter()

  useEffect(() => {
    if (state.code === '') return
    // TODO: 삭제 후 알맞은 곳으로 리디렉션하기
    // 게시판, 영화 상세 정보 페이지, 내가 쓴 리뷰 목록 등 여러 곳에서 리뷰에 접근 할 수 있기 때문에
    // searchParams에 from을 넣는 것도 고려
    if (state.code === COMMON_CODES.SUCCESS) router.replace('/')

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [router, state])

  return (
    <>
      <form action={formAction}>
        <button className='btn btn-secondary rounded-xl' type='submit' disabled={isPending}>
          {isPending ? <span className='loading loading-ring' /> : '삭제'}
        </button>
      </form>
    </>
  )
}
