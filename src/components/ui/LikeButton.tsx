'use client'

import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import { REVIEW_CODES, REVIEW_MESSAGES } from '@/constants/messages/reviews'
import { toggleLikeAction } from '@/lib/actions/like'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function LikeButton({
  likedByUser,
  likeCount,
  reviewId,
  readOnly = false,
}: {
  likedByUser: boolean | null
  likeCount: number
  reviewId: string
  readOnly: boolean
}) {
  const router = useRouter()

  const [state, formAction] = useActionState(toggleLikeAction.bind(null, reviewId), {
    likedByUser,
    likeCount,
    code: '',
  })

  useEffect(() => {
    if (state.code === '') return

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
    }
    if (state.code === REVIEW_CODES.REVIEW_NOT_FOUND) {
      toast.error(REVIEW_MESSAGES.REVIEW_NOT_FOUND)
      router.back()
    }
  }, [router, state])

  if (readOnly || likedByUser === null)
    return (
      <div className='flex gap-1'>
        <Heart className={clsx(likedByUser && 'fill-primary stroke-primary')} />
        <p>{likeCount}</p>
      </div>
    )

  return (
    <>
      <form action={formAction}>
        <div className='flex gap-1'>
          <button
            className={clsx(
              'cursor-pointer active:animate-ping',
              !state.likedByUser && 'animate-pulse'
            )}
            type='submit'
          >
            <Heart
              className={clsx(
                state.likedByUser
                  ? 'fill-primary stroke-primary'
                  : 'hover:fill-primary hover:stroke-primary'
              )}
            />
          </button>
          <p>{state.likeCount}</p>
        </div>
      </form>
    </>
  )
}
