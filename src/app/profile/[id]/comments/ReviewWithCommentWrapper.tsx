import { getRelativeTime } from '@/utils/date'
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
      <div className='space-y-2 rounded-2xl bg-black/3.5 p-4 dark:bg-white/5'>
        <p className='text-gray-400'>{getRelativeTime(comment.createdAt)}</p>
        <p className='line-clamp-1 break-all'>{comment.content}</p>
        {children}
      </div>
    </Link>
  )
}
