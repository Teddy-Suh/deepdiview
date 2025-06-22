import { tmdbIdSchema } from '../common/tmdbId'
import { baseReviewServerSchema } from '../common/baseReview'

export const createReviewServerSchema = baseReviewServerSchema.extend({
  tmdbId: tmdbIdSchema,
})
