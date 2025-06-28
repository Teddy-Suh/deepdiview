'use client'

import { useActionState, useEffect } from 'react'
import { deleteReviewAction } from './actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const searchParams = useSearchParams()
  const rawFrom = searchParams.get('from') ?? ''
  const from = decodeURIComponent(rawFrom)
  const isSafeFrom = from.startsWith('/') && !from.startsWith('//')

  const [state, formAction, isPending] = useActionState<{
    code: string
  }>(deleteReviewAction.bind(null, reviewId), {
    code: '',
  })
  const router = useRouter()

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.SUCCESS) {
      if (isSafeFrom) {
        router.replace(from)
      } else {
        router.back()
      }
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
  }, [from, isSafeFrom, router, state])

  return (
    <>
      <form action={formAction}>
        <button className='btn btn-secondary' type='submit' disabled={isPending}>
          {isPending ? <span className='loading loading-ring' /> : '삭제'}
        </button>
      </form>
    </>
  )
}
