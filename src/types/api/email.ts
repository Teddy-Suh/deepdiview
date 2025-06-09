import { z } from 'zod'
import { sendEmailSchema } from '@/schemas/auth/sendEmailSchema'
import { verifyEmailSchema } from '@/schemas/auth/verifyEmailSchema'

// 이메일 인증 전송
export type SendEmailRequest = z.infer<typeof sendEmailSchema>

// 이메일 인증
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>
