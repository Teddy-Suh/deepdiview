import { z } from 'zod'
import { emailSchema } from '../common/email'

export const sendEmailSchema = z.object({
  email: emailSchema,
})
