import { z } from 'zod'

export const tmdbIdSchema = z.string().transform(Number)
