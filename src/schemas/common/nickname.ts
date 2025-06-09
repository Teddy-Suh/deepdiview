import { z } from 'zod'

export const nicknameSchema = z
  .string()
  .trim()
  .nonempty('닉네임을 입력해 주세요.')
  .min(2, '최소 2자 이상이어야 합니다.')
  .max(10, '최대 10자 이하이어야 합니다.')
  .refine((val) => !/ {2,}/.test(val), {
    message: '연속된 공백은 사용할 수 없습니다.',
  })
