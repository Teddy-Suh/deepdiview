'use client'

import { toggleLikeAction } from '@/lib/actions/like'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useActionState } from 'react'

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
  const [state, formAction] = useActionState(toggleLikeAction.bind(null, reviewId), {
    likedByUser,
    likeCount,
    message: '',
  })

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
      {state.message && <p>좋아요 실패</p>}
    </>
  )
}
