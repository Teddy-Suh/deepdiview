'use client'

import { ClientComment, Comment } from '@/types/api/common'
import CommentItem from './CommentItem'
import { useEffect, useRef } from 'react'

export default function CommentList({
  comments,
  reviewId,
  currentUserId,
  isCommentPending,
  setIsCommentPending,
  editingCommentId,
  onEditClick,
  onDeleteSuccess,
}: {
  comments: ClientComment[]
  reviewId: string
  currentUserId: string
  isCommentPending: boolean
  setIsCommentPending: (value: boolean) => void
  editingCommentId: number | null
  onEditClick: (comment: Comment) => void
  onDeleteSuccess: (commentId: string) => void
}) {
  const optimisticRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    const hasCreating = comments.some((c) => c.optimisticStatus === 'creating')
    if (hasCreating) {
      optimisticRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [comments])

  return (
    <ul>
      {comments.map((comment) => (
        <li
          key={comment.id === -1 ? 'optimistic' : comment.id}
          ref={comment.optimisticStatus === 'creating' ? optimisticRef : null}
        >
          <CommentItem
            comment={comment}
            reviewId={reviewId}
            currentUserId={currentUserId}
            isCommentPending={isCommentPending}
            setIsCommentPending={setIsCommentPending}
            isEditComment={editingCommentId === comment.id}
            onEditClick={onEditClick}
            onDeleteSuccess={onDeleteSuccess}
          />
        </li>
      ))}
    </ul>
  )
}
