'use server'

import { auth } from '@/auth'
import { createComment, deleteComment, updateComment } from '@/lib/api/comment'
import { deleteReview } from '@/lib/api/review'

// TODO: toast로 message 띄위기
export const createCommentAction = async (reviewId: string, content: string) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    const comment = await createComment(reviewId, session.accessToken, {
      content,
    })
    return { message: 'success', comment }
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === 'REVIEW_NOT_FOUND') {
      return { message: '존재하지 않은 리뷰입니다.' }
    }
    throw new Error('UNHANDLED_ERROR')
  }
}

export const updateCommentAction = async (reviewId: string, commentId: string, content: string) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    const comment = await updateComment(reviewId, commentId, { content }, session.accessToken)
    return { message: 'success', comment: comment }
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { message: '존재하지 않는 리뷰입니다.' }
      case 'COMMENT_NOT_FOUND':
        return { message: '댓글이 존재하지 않습니다.' }
      case 'INVALID_USER':
        return { message: '댓글 작성자가 아닙니다.' }
      case 'COMMENT_NOT_BELONG_TO_REVIEW':
        return { message: '댓글이 해당 리뷰에 속하지 않습니다.' }
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

export const deleteCommentAction = async (
  reviewId: string,
  commentId: string,
  state: { message: string; commentId: string }
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await deleteComment(reviewId, commentId, session.accessToken)
    return { ...state, message: 'success', commentId }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { ...state, message: '존재하지 않는 리뷰입니다.' }
      case 'COMMENT_NOT_FOUND':
        return { ...state, message: '댓글이 존재하지 않습니다.' }
      case 'INVALID_USER':
        return { ...state, message: '작성자만 가능합니다.' }
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

export const deleteReviewAction = async (
  reviewId: string,
  state: { success: boolean | null; message: string }
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await deleteReview(reviewId, session.accessToken)
    return { ...state, success: true }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { ...state, success: false, message: '존재하지 않는 리뷰입니다.' }
      case 'INVALID_USER':
        return { ...state, success: false, message: '작성자만 가능합니다.' }
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
