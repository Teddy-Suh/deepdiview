import { z } from 'zod'
import { passwordSchema } from '../common/password'

export const registerPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  // 비밀번호와 비밀번호 확인이 일치하지 않으면 에러
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  })

export type registerPasswordInput = z.infer<typeof registerPasswordSchema>
