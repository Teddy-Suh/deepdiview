'use client'

import Image from 'next/image'
import { deleteCommentAction } from './actions'
import { useActionState, useEffect } from 'react'
import { ClientComment, Comment } from '@/types/api/common'
import Link from 'next/link'
import { getRelativeTime } from '@/utils/date'
import clsx from 'clsx'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'
import { REVIEW_CODES, REVIEW_MESSAGES } from '@/constants/messages/review'
import { useRouter } from 'next/navigation'

export default function CommentItem({
  comment,
  reviewId,
  currentUserId,
  isCommentPending,
  setIsCommentPending,
  isEditComment,
  onEditClick,
  onDeleteSuccess,
}: {
  comment: ClientComment
  reviewId: string
  currentUserId: string
  isCommentPending: boolean
  setIsCommentPending: (value: boolean) => void
  isEditComment: boolean
  onEditClick: (comment: Comment) => void
  onDeleteSuccess: (commentId: string) => void
}) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    deleteCommentAction.bind(null, reviewId, comment.id.toString()),
    {
      code: '',
      commentId: '',
    }
  )
  const isMyComment = currentUserId === comment.userId.toString()
  const isMyRecentCreatedComment =
    isMyComment &&
    comment.optimisticStatus === undefined &&
    Date.now() - new Date(comment.createdAt).getTime() < 2000

  // 삭제 중
  // CommentForm 작성, 내가 쓴 다른 댓글의 수정, 삭제 비활성화
  useEffect(() => {
    if (isPending) setIsCommentPending(true)
  }, [isPending, setIsCommentPending])

  // 삭제 성공
  useEffect(() => {
    if (state.code === '') return
    setIsCommentPending(false)

    // 성공 시
    if (state.code === COMMON_CODES.SUCCESS) {
      onDeleteSuccess(state.commentId)
      return
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }

    if (state.code === REVIEW_CODES.REVIEW_NOT_FOUND) {
      toast.error(REVIEW_MESSAGES.REVIEW_NOT_FOUND)
      router.back()
      return
    }
  }, [onDeleteSuccess, router, setIsCommentPending, state])

  return (
    <div
      className={clsx(
        'overflow-hidden transition-all duration-150',
        // 작성시 낙관적 렌더링 (배경색)
        comment.optimisticStatus === 'creating' && 'bg-warning/20',
        // 수정시 낙관적 렌더링 (배경색)
        isEditComment && 'bg-success/20 opacity-50',
        comment.optimisticStatus === 'updating' && 'opacity-100',
        // 삭제 시 낙관적 렌더링 (배경색) (isPending으로 처리)
        isPending && 'bg-error/20 opacity-50',
        // 작성 완료 직후 실제 댓글로 전환될 때 부드러운 배경 애니메이션 처리
        isMyRecentCreatedComment && 'animate-create-comment-success'
      )}
    >
      <div className='space-y-2 p-2'>
        {/* 댓글 헤더 */}
        <div className='flex justify-between'>
          <Link href={`/profile/${comment.userId}`}>
            <div className='flex items-center gap-1.5'>
              <Image
                className='rounded-full'
                src={comment.profileImageUrl}
                alt='프로필 사진'
                width={25}
                height={25}
              />
              <p className='text-sm'>{comment.userNickname}</p>
              <p className='text-xs text-gray-400'>
                {/* 삭제 시 낙관적 렌더링 (작성시간 대신 상태) */}
                {isPending ? (
                  <>
                    삭제 중 <span className='loading loading-ring loading-xs' />
                  </>
                ) : (
                  <>
                    {/* 작성, 수정시 낙관적 렌더링 (작성시간 대신 상태) */}
                    {!!comment.optimisticStatus ? (
                      <>
                        {comment.createdAt} <span className='loading loading-ring loading-xs' />
                      </>
                    ) : (
                      <>
                        {getRelativeTime(comment.createdAt)}{' '}
                        {comment.updatedAt !== comment.createdAt && '(수정됨)'}
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </Link>
          {isMyComment && !isEditComment && comment.optimisticStatus !== 'creating' && (
            <div className='flex items-center gap-1'>
              <button
                className='btn btn-soft btn-primary btn-xs rounded-xl'
                type='button'
                onClick={() => onEditClick(comment)}
                disabled={isCommentPending}
              >
                수정
              </button>
              <form action={formAction}>
                <button
                  className='btn btn-soft btn-secondary btn-xs rounded-xl'
                  type='submit'
                  disabled={isCommentPending}
                >
                  삭제
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 댓글 내용 */}
        <div className={clsx('bg-base-300 rounded-3xl px-4 py-2')}>
          <p className='break-words break-keep'>{comment.content}</p>
        </div>
      </div>

      {/* 구분선 */}
      <hr className='text-gray-300 dark:text-gray-700' />
    </div>
  )
}
