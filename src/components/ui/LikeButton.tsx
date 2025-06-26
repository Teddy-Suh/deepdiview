'use client'

import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import { REVIEW_CODES, REVIEW_MESSAGES } from '@/constants/messages/review'
import { toggleLikeAction } from '@/lib/actions/like'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useOptimistic, useState, startTransition } from 'react'
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
  readOnly?: boolean
}) {
  const router = useRouter()
  const [localState, setLocalState] = useState({
    likedByUser,
    likeCount,
  })

  const [optimisticState, setOptimisticState] = useOptimistic(
    localState,
    (state, newLikedByUser: boolean) => ({
      ...state,
      likedByUser: newLikedByUser,
      likeCount: newLikedByUser ? state.likeCount + 1 : state.likeCount - 1,
    })
  )

  const formAction = async () => {
    setOptimisticState(!optimisticState.likedByUser)

    startTransition(async () => {
      const { code } = await toggleLikeAction(optimisticState.likedByUser, reviewId)

      if (code === COMMON_CODES.SUCCESS) {
        startTransition(() => {
          setLocalState({
            likedByUser: !optimisticState.likedByUser,
            likeCount: !optimisticState.likedByUser
              ? optimisticState.likeCount + 1
              : optimisticState.likeCount - 1,
          })
        })
        return
      }

      if (code === COMMON_CODES.NETWORK_ERROR) {
        toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
        return
      }

      if (code === REVIEW_CODES.REVIEW_NOT_FOUND) {
        toast.error(REVIEW_MESSAGES.REVIEW_NOT_FOUND)
        router.back()
        return
      }
    })
  }

  if (readOnly || likedByUser === null) {
    return (
      <div className='flex gap-1'>
        <Heart className={clsx(likedByUser && 'fill-primary stroke-primary')} />
        <p>{likeCount}</p>
      </div>
    )
  }
  return (
    <>
      <form action={formAction}>
        <div className='flex gap-1'>
          <button
            className={clsx(
              'cursor-pointer active:animate-ping',
              !optimisticState.likedByUser && 'animate-pulse'
            )}
            type='submit'
          >
            <Heart
              className={clsx(
                optimisticState.likedByUser
                  ? 'fill-primary stroke-primary'
                  : 'hover:fill-primary hover:stroke-primary'
              )}
            />
          </button>
          <p>{optimisticState.likeCount}</p>
        </div>
      </form>
    </>
  )
}
