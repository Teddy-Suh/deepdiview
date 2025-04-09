'use server'

import { auth } from '@/auth'
import { createComment, deleteComment, updateComment } from '@/lib/api/comment'
import { deleteReview } from '@/lib/api/review'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// TODO: toast로 message 띄위기
export const createCommentAction = async (
  reviewId: string,
  state: { message: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 도입 (zod)
  const content = formData.get('content') as string

  try {
    await createComment(reviewId, session.accessToken, {
      content,
    })
    revalidatePath(`/reviews/${reviewId}`)
    return { message: '' }
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === 'REVIEW_NOT_FOUND') {
      return { ...state, message: '존재하지 않은 리뷰입니다.' }
    }
    throw new Error('UNHANDLED_ERROR')
  }
}

export const updateCommentAction = async (
  reviewId: string,
  commentId: string,
  state: { message: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // TODO: 유효성 검사 도입 (zod)
  const content = formData.get('content') as string

  try {
    await updateComment(reviewId, commentId, { content }, session.accessToken)
    revalidatePath(`/reviews/${reviewId}`)
    return { message: '' }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { ...state, message: '존재하지 않는 리뷰입니다.' }
      case 'COMMENT_NOT_FOUND':
        return { ...state, message: '댓글이 존재하지 않습니다.' }
      case 'INVALID_USER':
        return { ...state, message: '댓글 작성자가 아닙니다.' }
      case 'COMMENT_NOT_BELONG_TO_REVIEW':
        return { ...state, message: '댓글이 해당 리뷰에 속하지 않습니다.' }
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}

export const deleteCommentAction = async (reviewId: string, commentId: string) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await deleteComment(reviewId, commentId, session.accessToken)
    revalidatePath(`/reviews/${reviewId}`)
    return { message: '' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        throw error
      case 'INVALID_USER':
        throw error
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}

export const deleteReviewAction = async (reviewId: string) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await deleteReview(reviewId, session.accessToken)
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        throw error
      case 'INVALID_USER':
        throw error
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }

  // TODO: 삭제 후 알맞은 곳으로 리디렉션하기
  // 게시판, 영화 상세 정보 페이지, 내가 쓴 리뷰 목록 등 여러 곳에서 리뷰에 접근 할 수 있기 때문에
  // searchParams에 from을 넣는 것도 고려
  redirect('/')
}
