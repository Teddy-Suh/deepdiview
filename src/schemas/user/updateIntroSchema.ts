import { z } from 'zod'

export const updateIntroSchema = z.object({
  oneLineIntro: z.string().max(50, '최대 50자 이하이어야 합니다.'),
})
