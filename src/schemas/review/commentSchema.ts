import { z } from 'zod'

export const commentSchema = z.object({
  content: z.string().max(500, '최대 500자 이하이어야 합니다.').nonempty(''),
})
