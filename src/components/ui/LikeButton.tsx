'use client'

import { toggleLikeAction } from '@/lib/actions/like'
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
      <button className='btn' disabled={likedByUser === null}>
        {state.likedByUser ? '❤️' : '🤍'}
      </button>
      {state.likeCount}
      {state.message && <p>좋아요 실패</p>}
    </form>
  )
}
