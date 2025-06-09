import { z } from 'zod'
import { emailSchema } from '../common/email'

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .nonempty('인증 코드를 입력해 주세요.')
    .regex(/^\d+$/, { message: '숫자만 입력할 수 있습니다.' })
    .length(6, { message: '인증 코드는 6자리입니다.' }),
})
