'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { createCommentAction, updateCommentAction } from './actions'
import Link from 'next/link'
import { useSession } from '@/providers/providers'
import clsx from 'clsx'
import { ClientComment, Comment } from '@/types/api/common'

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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const action = isEdit
    ? updateCommentAction.bind(null, reviewId, editComment.id.toString())
    : createCommentAction.bind(null, reviewId)

  const [state, formAction, isPending] = useActionState<
    {
      success: boolean | null
      message: string
      comment: Comment | null
    },
    FormData
  >(action, {
    success: null,
    message: '',
    comment: null,
  })

  // 수정 시 기존 댓글 폼에 넣기
  useEffect(() => {
    if (editComment) {
      setContent(editComment.content)
      inputRef.current?.focus()
    } else {
      setContent('')
    }
  }, [editComment])

  // 낙관적 렌더링
  useEffect(() => {
    if (!isPending) return
    setIsCommentPending(true)

    // 서버 응답을 기다리는 isPending일때 낙관적 렌더링
    if (isEdit) {
      // 수정 시
      addOptimisticComment({
        ...editComment,
        content,
        createdAt: '수정 중',
        updatedAt: new Date().toISOString(),
        optimisticStatus: 'updating',
      })
    } else {
      // 작성 시
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
      })
    }
  }, [
    addOptimisticComment,
    content,
    editComment,
    isEdit,
    isPending,
    reviewId,
    session?.user?.nickname,
    session?.user?.profileImageUrl,
    session?.user?.userId,
    setIsCommentPending,
  ])

  // 서버 응답 받은 후
  useEffect(() => {
    if (state.success === null) return
    setIsCommentPending(false)

    // 성공 또는 실패
    // 성공 시
    if (state.success && state.comment) {
      setContent('')
      // 수정 성공시
      if (isEdit) {
        setEditComment(null)
        console.log('수정 댓글 응답', state.comment)
        onEditSuccess(state.comment)
      }
      // 작성 성공시
      else {
        onCreateSuccess(state.comment)
      }
    }
    // 실패 시
    else {
      onFail()
    }

    // 상태 초기화 (useActionState 재사용을 위해 필요)
    state.success = null
  }, [
    isEdit,
    onCreateSuccess,
    onEditSuccess,
    onFail,
    setEditComment,
    setIsCommentPending,
    state,
    state.message,
  ])

  // 모바일 키보드 감지
  useEffect(() => {
    const threshold = 150
    const initialHeight = window.innerHeight

    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight
      setIsKeyboardVisible(heightDiff > threshold)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <div
        className={clsx(
          'bg-base-100 container-wrapper fixed right-0 left-0 z-10 py-2 md:sticky md:px-0',
          isKeyboardVisible
            ? 'bottom-0' // 키보드 올라올 시 키보드 위에 붙이기
            : 'bottom-16 md:bottom-0' // 키보드 내려갔을땐 BottomNav 위에 붙이기
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
              value={isPending ? '' : content}
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
          {/* TODO: 에러 토스트 메세지로 띄우기 */}
          {state.message !== '' && <p>{state.message}</p>}
        </form>
      </div>
      <div className='h-14 md:h-0' />
    </>
  )
}
