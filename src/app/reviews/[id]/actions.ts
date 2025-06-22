'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { REVIEW_CODES } from '@/constants/messages/reviews'
import { createComment, deleteComment, updateComment } from '@/lib/api/comment'
import { deleteReview } from '@/lib/api/review'
import { commentSchema } from '@/schemas/review/commentSchema'
import { redirect } from 'next/navigation'

export const createCommentAction = async (reviewId: string, content: string) => {
  const session = await auth()
  if (!session) redirect('/login')

  const validatedFields = commentSchema.safeParse({
    content,
  })
  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }
  const { content: validatedContent } = validatedFields.data

  try {
    const comment = await createComment(reviewId, session.accessToken, {
      content: validatedContent,
    })
    return { code: COMMON_CODES.SUCCESS, comment }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.REVIEW_NOT_FOUND:
        return { code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const updateCommentAction = async (reviewId: string, commentId: string, content: string) => {
  const session = await auth()
  if (!session) redirect('/login')

  const validatedFields = commentSchema.safeParse({
    content,
  })
  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }
  const { content: validatedContent } = validatedFields.data

  try {
    const comment = await updateComment(
      reviewId,
      commentId,
      { content: validatedContent },
      session.accessToken
    )
    return { code: COMMON_CODES.SUCCESS, comment: comment }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.REVIEW_NOT_FOUND:
        return { code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const deleteCommentAction = async (
  reviewId: string,
  commentId: string,
  state: { code: string; commentId: string }
) => {
  const session = await auth()
  if (!session) throw redirect('/login')

  try {
    await deleteComment(reviewId, commentId, session.accessToken)
    return { ...state, code: COMMON_CODES.SUCCESS as string, commentId }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.REVIEW_NOT_FOUND:
        return { ...state, code: errorCode as string }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const deleteReviewAction = async (reviewId: string, state: { code: string }) => {
  const session = await auth()
  if (!session) redirect('/login')

  try {
    await deleteReview(reviewId, session.accessToken)
    return { ...state, code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
