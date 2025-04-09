'use client'

import { CircleUserRound } from 'lucide-react'
import Image from 'next/image'
import { deleteCommentAction } from './actions'
import { useActionState } from 'react'
import { Comment } from '@/types/api/common'
import Link from 'next/link'

export default function CommentItem({
  comment,
  reviewId,
  currentUserId,
  onEdit,
}: {
  comment: Comment
  reviewId: string
  currentUserId: string
  onEdit: (commentId: string, content: string) => void
}) {
  const isMine = currentUserId === comment.userId.toString()

  const [state, formAction] = useActionState(
    deleteCommentAction.bind(null, reviewId, comment.id.toString()),
    { message: '' }
  )

  return (
    <li key={comment.id}>
      <Link className='flex' href={`/profile/${comment.userId}`}>
        {comment.profileImageUrl ? (
          <Image src={comment.profileImageUrl} alt='프로필 사진' width={20} height={20} />
        ) : (
          <CircleUserRound />
        )}
        <p>{comment.userNickname}</p>
      </Link>
      <p>{comment.content}</p>

      {isMine && (
        <div className='flex gap-2'>
          <form action={formAction}>
            <button type='submit' className='text-sm text-red-500'>
              삭제
            </button>
          </form>
          <button
            onClick={() => onEdit(comment.id.toString(), comment.content)}
            className='text-sm text-blue-500'
          >
            수정
          </button>
        </div>
      )}
      {state?.message && <p className='mt-1 text-sm text-red-500'>{state.message}</p>}
    </li>
  )
}
