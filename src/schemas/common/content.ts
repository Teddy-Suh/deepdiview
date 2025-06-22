import { z } from 'zod'

export const contentSchema = z.string().max(10000, '').nonempty('')
