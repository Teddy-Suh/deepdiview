import { SendEmailRequest, VerifyEmailRequest } from '@/types/api/email'
import { apiClient } from '../apiClient'

// 이메일 인증 전송
export async function sendEmail(body: SendEmailRequest): Promise<null> {
  return apiClient<null, SendEmailRequest>(`/emails/send`, {
    method: 'POST',
    body,
  })
}

// 이메일 인증
export async function verifyEmail(body: VerifyEmailRequest): Promise<null> {
  return apiClient<null, VerifyEmailRequest>(`/emails/verify`, {
    method: 'POST',
    body,
  })
}
