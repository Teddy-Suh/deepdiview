'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createCommentAction, updateCommentAction } from './actions'
import Link from 'next/link'
import { useSession } from '@/providers/providers'
import clsx from 'clsx'
import { ClientComment, Comment } from '@/types/api/common'
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard'

export default function CommentForm({
  reviewId,
  editComment,
  isCommentPending,
  setIsCommentPending,
  setEditComment,
  onCreateSuccess,
  onEditSuccess,
  onFail,
  addOptimisticComment,
}: {
  reviewId: string
  editComment: Comment | null
  isCommentPending: boolean
  setIsCommentPending: (value: boolean) => void
  setEditComment: (value: null) => void
  onCreateSuccess: (newComment: Comment) => void
  onEditSuccess: (comment: Comment) => void
  onFail: () => void
  addOptimisticComment: (comment: ClientComment) => void
}) {
  const session = useSession()
  const isEdit = !!editComment
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { isKeyboardVisible } = useMobileKeyboard()
  const [isPending, startTransition] = useTransition()

  const createFormAction = async (content: string) => {
    // 낙관적 렌더링
    addOptimisticComment({
      id: -1,
      reviewId: Number(reviewId),
      userId: Number(session?.user?.userId),
      userNickname: session?.user?.nickname || '',
      profileImageUrl: session?.user?.profileImageUrl || '',
      content,
      createdAt: '작성 중',
      updatedAt: new Date().toISOString(),
      optimisticStatus: 'creating',
      review: null,
    })

    const result = await createCommentAction(reviewId, content)

    if (result.message === 'success' && result.comment) {
      onCreateSuccess(result.comment)
    } else {
      onFail()
    }
  }

  const updateFormAction = async (content: string) => {
    if (!editComment) return

    addOptimisticComment({
      ...editComment,
      content,
      optimisticStatus: 'updating',
      updatedAt: new Date().toISOString(),
      createdAt: '수정 중',
    })

    const result = await updateCommentAction(reviewId, editComment.id.toString(), content)

    if (result.message === 'success' && result.comment) {
      onEditSuccess(result.comment)
    } else {
      onFail()
    }

    setEditComment(null)
  }

  const formAction = async (formData: FormData) => {
    const content = formData.get('content')?.toString() ?? ''
    startTransition(async () => {
      if (isEdit) {
        await updateFormAction(content)
      } else {
        await createFormAction(content)
      }
    })
    setContent('')
  }

  // 수정 시 기존 댓글 폼에 넣기
  useEffect(() => {
    if (editComment) {
      setContent(editComment.content)
      inputRef.current?.focus()
    } else {
      setContent('')
    }
  }, [editComment])

  useEffect(() => {
    if (isPending) {
      setIsCommentPending(true)
    } else {
      setIsCommentPending(false)
    }
  }, [isPending, setIsCommentPending])

  return (
    <>
      <div
        className={clsx(
          'bg-base-100 container-wrapper fixed right-0 left-0 z-10 py-2 md:sticky md:px-0',
          isKeyboardVisible ? 'bottom-0' : 'bottom-16 md:bottom-0'
        )}
      >
        <form action={formAction}>
          <div className='flex items-center gap-2'>
            <input
              className={clsx(
                'bg-base-300 flex-1 rounded-2xl border-0 px-4 py-2 outline-0',
                isCommentPending && 'text-gray-500'
              )}
              ref={inputRef}
              type='text'
              name='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!session || isPending || isCommentPending}
              placeholder={session ? '댓글을 입력하세요' : '로그인 후 작성할 수 있어요'}
              required
            />

            <div className='flex gap-2'>
              {session ? (
                <>
                  <button
                    className='btn btn-primary rounded-2xl'
                    type='submit'
                    disabled={isPending || isCommentPending}
                  >
                    {isPending ? (
                      <span className='loading loading-ring' />
                    ) : (
                      <>{isEdit ? '수정' : '작성'}</>
                    )}
                  </button>
                  {isEdit && !isPending && (
                    <button
                      className='btn btn-secondary rounded-2xl'
                      type='button'
                      onClick={() => setEditComment(null)}
                      disabled={isCommentPending}
                    >
                      취소
                    </button>
                  )}
                </>
              ) : (
                <Link className='btn btn-primary rounded-2xl' href='/login'>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className='h-14 md:h-0' />
    </>
  )
}
