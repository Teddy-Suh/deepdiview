import { z } from 'zod'
import { emailSchema } from '../common/email'
import { passwordSchema } from '../common/password'
import { nicknameSchema } from '../common/nickname'

export const registerSchema = z
  .object({
    email: emailSchema,
    nickname: nicknameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  })
