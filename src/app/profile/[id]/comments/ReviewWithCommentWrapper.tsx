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
      <div className='space-y-2 rounded-3xl bg-black/4 p-4 dark:bg-white/4'>
        <p className='text-gray-400'>{getRelativeTime(comment.createdAt)}</p>
        <p className='line-clamp-1 break-all'>{comment.content}</p>
        {children}
      </div>
    </Link>
  )
}
