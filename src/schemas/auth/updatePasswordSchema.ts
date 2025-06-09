import { z } from 'zod'
import { passwordSchema } from '../common/password'

export const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    newConfirmPassword: passwordSchema,
  })
  // 현재 비밀번호와 새 비밀번호가 일치하면 에러
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: '현재 비밀번호와 새 비밀번호가 같습니다.',
  })
  // 새 비밀번호와 새 비밀번호 확인이 일치하지 않으면 에러
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    path: ['newConfirmPassword'],
    message: '새 비밀번호가 일치하지 않습니다.',
  })
