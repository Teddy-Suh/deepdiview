'use server'

import { auth } from '@/auth'
import { createComment, deleteComment, updateComment } from '@/lib/api/comment'
import { revalidatePath } from 'next/cache'

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
    const e = error as Error & {
      cause?: { err?: { message?: string } }
    }
    const errorCode = e?.cause?.err?.message ?? ''
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
    const e = error as Error & { cause?: { err?: { message?: string } } }
    const errorCode = e?.cause?.err?.message ?? ''

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

export const deleteCommentAction = async (
  reviewId: string,
  commentId: string,
  state: { message: string }
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await deleteComment(reviewId, commentId, session.accessToken)
    revalidatePath(`/reviews/${reviewId}`)
    return { message: '' }
  } catch (error) {
    const e = error as Error & { cause?: { err?: { message?: string } } }
    const errorCode = e?.cause?.err?.message ?? ''

    switch (errorCode) {
      case 'REVIEW_NOT_FOUND':
        return { ...state, message: '존재하지 않는 리뷰입니다.' }
      case 'COMMENT_NOT_FOUND':
        return { ...state, message: '댓글이 존재하지 않습니다.' }
      case 'INVALID_USER':
        return { ...state, message: '댓글 작성자가 아닙니다.' }
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
