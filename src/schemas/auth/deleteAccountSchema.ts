import { z } from 'zod'
import { passwordSchema } from '../common/password'

export const deleteAccountSchema = z.object({
  password: passwordSchema,
})
