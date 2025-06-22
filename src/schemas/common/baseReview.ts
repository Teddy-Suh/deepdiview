import { z } from 'zod'
import { titleSchema } from './title'
import { contentSchema } from './content'
import { ratingClientSchema, ratingServerSchema } from './rating'

export const baseReviewSchema = z.object({
  title: titleSchema,
  content: contentSchema,
})

export const baseReviewClientSchema = baseReviewSchema.extend({
  rating: ratingClientSchema,
})

export const baseReviewServerSchema = baseReviewSchema.extend({
  rating: ratingServerSchema,
})

export type baseReviewClientInput = z.infer<typeof baseReviewClientSchema>
