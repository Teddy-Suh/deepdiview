import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .nonempty('이메일을 입력해 주세요.')
  .email('유효한 이메일 형식이 아닙니다.')
