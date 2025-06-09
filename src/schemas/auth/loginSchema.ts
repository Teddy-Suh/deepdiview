import { z } from 'zod'
import { emailSchema } from '../common/email'
import { passwordSchema } from '../common/password'

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
