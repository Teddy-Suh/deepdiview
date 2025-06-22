'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { updateReview } from '@/lib/api/review'
import { updateReviewServerSchema } from '@/schemas/review/updateReviewSchema'
import { redirect } from 'next/navigation'

export const updateReviewAction = async (
  reviewId: string,
  state: { code: string; resReviewId: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) redirect('/login')

  const validatedFields = updateReviewServerSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    rating: formData.get('rating'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { title, content, rating } = validatedFields.data

  try {
    const { reviewId: resReviewId } = await updateReview(reviewId, session.accessToken, {
      title,
      content,
      rating,
    })
    return { ...state, code: COMMON_CODES.SUCCESS, resReviewId: resReviewId.toString() }
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
