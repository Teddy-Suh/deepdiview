import { z } from 'zod'

export const passwordSchema = z
  .string()
  .nonempty('비밀번호를 입력해 주세요.')
  .min(8, '최소 8자 이상이어야 합니다.')
  .max(16, '최대 16자 이하이어야 합니다.')
  .regex(/^(?=.*[a-z])(?=.*\d)[a-z\d]+$/, '영문 소문자와 숫자만 포함해야 합니다.')
