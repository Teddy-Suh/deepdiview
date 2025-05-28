'use client'

import { toggleLikeAction } from '@/lib/actions/like'
import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useActionState } from 'react'

export default function LikeButton({
  likedByUser,
  likeCount,
  reviewId,
}: {
  likedByUser: boolean | null
  likeCount: number
  reviewId: string
}) {
  const [state, formAction] = useActionState(toggleLikeAction.bind(null, reviewId), {
    likedByUser,
    likeCount,
    message: '',
  })

  return (
    <form action={formAction}>
      <button className='flex gap-1' disabled={likedByUser === null}>
        <Heart className={clsx(state.likedByUser && 'fill-primary stroke-primary')} />
        <p>{state.likeCount}</p>
      </button>
      {state.message && <p>좋아요 실패</p>}
    </form>
  )
}
