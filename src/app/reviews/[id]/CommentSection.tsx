'use client'

import { Comment } from '@/types/api/common'
import { useState } from 'react'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

export default function CommentSection({
  comments,
  currentUserId,
  reviewId,
}: {
  comments: Comment[]
  currentUserId: string
  reviewId: string
}) {
  const [editComment, setEditComment] = useState<null | {
    commentId: string
    content: string
  }>(null)

  return (
    <section>
      <h2>댓글</h2>
      <ul>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            reviewId={reviewId}
            currentUserId={currentUserId}
            onEdit={(commentId, content) => setEditComment({ commentId, content })}
          />
        ))}
      </ul>

      <CommentForm
        reviewId={reviewId}
        editComment={editComment ?? undefined}
        onCancel={() => setEditComment(null)}
      />
    </section>
  )
}
