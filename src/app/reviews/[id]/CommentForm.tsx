'use client'

import { useActionState, useEffect, useState } from 'react'
import { createCommentAction, updateCommentAction } from './actions'
import Link from 'next/link'
import { useSession } from '@/providers/providers'

export default function CommentForm({
  reviewId,
  editComment,
  onCancel,
}: {
  reviewId: string
  editComment?: {
    commentId: string
    content: string
  }
  onCancel: () => void
}) {
  const session = useSession()
  const isEdit = !!editComment
  const [content, setContent] = useState('')

  const action = isEdit
    ? updateCommentAction.bind(null, reviewId, editComment.commentId)
    : createCommentAction.bind(null, reviewId)

  const [state, formAction] = useActionState(action, { message: '' })

  // 수정 시 기존 댓글 폼에 넣기
  useEffect(() => {
    if (editComment) {
      setContent(editComment.content)
    } else {
      setContent('')
    }
  }, [editComment])

  // 수정, 삭제 성공시 폼 비우기
  // TODO: eslint-disable-next-line 없어도 동작하게 구현
  useEffect(() => {
    if (state?.message === '') {
      setContent('')
      if (editComment) {
        onCancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      {state?.message && (
        <div className='mt-2 text-sm text-red-500'>
          <p>{state.message}</p>
        </div>
      )}
      <form action={formAction} className='flex flex-col gap-2'>
        <input
          type='text'
          name='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!session}
          placeholder={session ? '댓글을 입력하세요' : '로그인 후 작성할 수 있어요'}
        />

        <div className='flex gap-2'>
          {session ? (
            <>
              <button type='submit'>{isEdit ? '수정 완료' : '댓글 작성'}</button>
              {isEdit && onCancel && (
                <button type='button' onClick={onCancel} className='text-sm text-gray-500'>
                  취소
                </button>
              )}
            </>
          ) : (
            <Link href='/login'>로그인</Link>
          )}
        </div>
      </form>
    </>
  )
}
