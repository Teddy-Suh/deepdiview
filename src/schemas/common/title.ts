import { z } from 'zod'

export const titleSchema = z.string().trim().max(60, '').nonempty('')
