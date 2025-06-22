'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { REVIEW_CODES } from '@/constants/messages/review'
import { createReview } from '@/lib/api/review'
import { createReviewServerSchema } from '@/schemas/review/createReviewSchema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createReviewAction = async (
  tmdbId: string,
  state: { code: string; resReviewId: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session) redirect('/')

  const validatedFields = createReviewServerSchema.safeParse({
    tmdbId,
    title: formData.get('title'),
    content: formData.get('content'),
    rating: formData.get('rating'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { tmdbId: id, title, content, rating } = validatedFields.data

  try {
    const { reviewId: resReviewId } = await createReview(session.accessToken, {
      tmdbId: id,
      title,
      content,
      rating,
    })

    revalidatePath(`/movies/${tmdbId}`)
    return { ...state, code: COMMON_CODES.SUCCESS, resReviewId: resReviewId.toString() }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case REVIEW_CODES.ALREADY_COMMITTED_REVIEW:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
