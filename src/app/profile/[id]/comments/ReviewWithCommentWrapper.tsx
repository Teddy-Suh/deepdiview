import { getRelativeTime } from '@/lib/utils/date'
import { CommentFields } from '@/types/api/common'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function ReviewWithCommentWrapper({
  children,
  comment,
}: {
  children: ReactNode
  comment: CommentFields
}) {
  return (
    <Link href={`/reviews/${comment.reviewId}`}>
      <div className='bg-base-200 space-y-2 rounded-2xl p-4'>
        <p className='text-gray-500'>{getRelativeTime(comment.createdAt)}</p>
        <p className='line-clamp-1 break-all'>{comment.content}</p>
        {children}
      </div>
    </Link>
  )
}
