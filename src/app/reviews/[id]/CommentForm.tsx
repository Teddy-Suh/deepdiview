'use client'

import { useEffect, useTransition } from 'react'
import { createCommentAction, updateCommentAction } from './actions'
import Link from 'next/link'
import clsx from 'clsx'
import { ClientComment, Comment } from '@/types/api/common'
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { REVIEW_CODES, REVIEW_MESSAGES } from '@/constants/messages/review'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CommentsRequest } from '@/types/api/comment'
import { commentSchema } from '@/schemas/review/commentSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Session } from 'next-auth'

export default function CommentForm({
  session,
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
  session: Session | null
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
  const router = useRouter()
  const isEdit = !!editComment
  const { isKeyboardVisible } = useMobileKeyboard()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    setValue,
    setFocus,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentsRequest>({
    resolver: zodResolver(commentSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (errors.content?.message) {
      toast.error(errors.content.message)
    }
  }, [errors.content?.message])

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

    if (result.code === COMMON_CODES.SUCCESS && result.comment) {
      onCreateSuccess(result.comment)
    } else {
      onFail()
      if (result.code === COMMON_CODES.NETWORK_ERROR) {
        toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
        reset({ content })
      }
      if (result.code === REVIEW_CODES.REVIEW_NOT_FOUND) {
        toast.error(REVIEW_MESSAGES.REVIEW_NOT_FOUND)
        router.back()
      }
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

    if (result.code === COMMON_CODES.SUCCESS && result.comment) {
      onEditSuccess(result.comment)
    } else {
      onFail()
      if (result.code === COMMON_CODES.NETWORK_ERROR) {
        toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      }
      if (result.code === REVIEW_CODES.REVIEW_NOT_FOUND) {
        toast.error(REVIEW_MESSAGES.REVIEW_NOT_FOUND)
        router.back()
      }
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
  }

  // 수정 시 기존 댓글 폼에 넣기
  useEffect(() => {
    if (editComment) {
      setValue('content', editComment.content)
      setFocus('content')
    } else {
      setValue('content', '')
    }
  }, [editComment, setFocus, setValue])

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
          'container-wrapper bg-base-100 fixed right-0 left-0 z-10 w-full py-2 md:sticky md:px-0',
          isKeyboardVisible ? 'bottom-0' : 'bottom-16 md:bottom-0'
        )}
      >
        <form action={formAction}>
          <div className='flex gap-2'>
            <label className='bg-base-300 flex-1 rounded-full px-4 py-2'>
              <input
                {...register('content')}
                className={clsx('w-full border-0 outline-0', isCommentPending && 'text-gray-500')}
                type='text'
                disabled={!session || isPending || isCommentPending}
                placeholder={session ? '댓글을 입력하세요' : '로그인 후 작성할 수 있어요'}
              />
            </label>
            <div className='flex gap-2'>
              {session ? (
                <>
                  <button
                    className='btn btn-primary'
                    type='submit'
                    disabled={isPending || isCommentPending || !isValid}
                  >
                    {isPending ? (
                      <span className='loading loading-ring' />
                    ) : (
                      <>{isEdit ? '수정' : '작성'}</>
                    )}
                  </button>
                  {isEdit && !isPending && (
                    <button
                      className='btn btn-secondary'
                      type='button'
                      onClick={() => setEditComment(null)}
                      disabled={isCommentPending}
                    >
                      취소
                    </button>
                  )}
                </>
              ) : (
                <Link className='btn btn-primary' href={`/login?from=/reviews/${reviewId}`}>
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
