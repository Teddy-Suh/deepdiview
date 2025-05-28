'use client'

import { useEffect, useOptimistic, useRef, useState } from 'react'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { getComments } from '@/lib/api/comment'
import CommentLoading from './CommentLoading'
import { ClientComment, Comment } from '@/types/api/common'

export default function CommentSection({
  reviewId,
  currentUserId,
}: {
  reviewId: string
  currentUserId: string
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isInitialFetching, setIsInitialFetching] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [nextCreatedAt, setNextCreatedAt] = useState<string>('')
  const [nextId, setNextId] = useState<number>()
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [editComment, setEditComment] = useState<Comment | null>(null)
  // 작성, 수정, 삭제 하는 동안 CommentForm의 작성, 내가 쓴 다른 댓글의 수정, 삭제 비활성화 용
  const [isCommentPending, setIsCommentPending] = useState(false)

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  // 낙관적 렌더링 (작성, 수정)
  // 삭제는 CommentItem에서 처리
  const [optimisticComments, addOptimisticComment] = useOptimistic<ClientComment[], ClientComment>(
    comments,
    (state, newComment) => {
      switch (newComment.optimisticStatus) {
        // 작성시 낙관적으로 댓글 추가
        case 'creating':
          return [newComment, ...state]
        // 수정시 낙관적으로 댓글 교체
        case 'updating':
          return state.map((comment) =>
            comment.id === newComment.id ? { ...comment, ...newComment } : comment
          )
        default:
          return state
      }
    }
  )

  // 성공시 호출 함수
  // 댓글 작성
  // Comments에 성공 응답으로 받은 댓글  추가
  const handleCreateSuccess = (createdComment: Comment) => {
    setComments((prev) => [createdComment, ...prev])
  }

  // 댓글 수정
  // Comments에 성공 응답으로 받은 댓글로 교체
  const handleEditSuccess = (updatedComment: Comment) => {
    console.log('수정응답', updatedComment)
    setComments((prev) =>
      prev.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
    )
  }

  // 댓글 삭제
  // Comments에 해당 댓글 삭제
  const handleDeleteSuccess = (deletedCommentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== Number(deletedCommentId)))
  }

  // 실패시 호출 함수 (작성, 수정)
  const handleFail = () => {
    setComments((prev) => [...prev])
  }

  // 첫 페이지 받아오기
  useEffect(() => {
    async function fetchInitialComments() {
      const res = await getComments(reviewId, {
        size: 10,
      })
      setComments(res.content)
      setNextId(res.nextId)
      setNextCreatedAt(res.nextCreatedAt)
      setHasNext(res.hasNext)

      setIsInitialFetching(false)
    }

    fetchInitialComments()
  }, [reviewId])

  // 다음 페이지 받아오기 (무한 스크롤)
  useEffect(() => {
    if (isInitialFetching) return

    const target = loaderRef.current
    if (!target || !hasNext) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          setIsFetching(true)
          const res = await getComments(reviewId, {
            commentId: nextId,
            createdAt: nextCreatedAt,
            size: 10,
          })

          setComments((prev) => [...prev, ...res.content])
          setNextId(res.nextId)
          setNextCreatedAt(res.nextCreatedAt)
          setHasNext(res.hasNext)

          setIsFetching(false)
          isFetchingRef.current = false
        }
      },
      {
        threshold: 0.3,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasNext, isInitialFetching, nextCreatedAt, nextId, reviewId])

  return (
    <section className='container-wrapper pt-4 md:px-24 lg:px-32'>
      {isInitialFetching ? (
        <CommentLoading />
      ) : (
        <CommentList
          comments={optimisticComments}
          reviewId={reviewId}
          currentUserId={currentUserId}
          isCommentPending={isCommentPending}
          setIsCommentPending={setIsCommentPending}
          editingCommentId={editComment?.id ?? null}
          onEditClick={(comment: Comment) => setEditComment(comment)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
      {isFetching && (
        <div className='mt-2 w-full text-center md:mt-3'>
          <span className='loading loading-ring loading-xl text-primary' />
        </div>
      )}
      {hasNext && <div ref={loaderRef} className='h-1 w-full opacity-0' />}
      <CommentForm
        reviewId={reviewId}
        editComment={editComment}
        isCommentPending={isCommentPending}
        setIsCommentPending={setIsCommentPending}
        setEditComment={setEditComment}
        onCreateSuccess={handleCreateSuccess}
        onEditSuccess={handleEditSuccess}
        onFail={handleFail}
        addOptimisticComment={addOptimisticComment}
      />
    </section>
  )
}
