import { z } from 'zod'
import { nicknameSchema } from '../common/nickname'

export const updateNicknameSchema = z.object({
  newNickname: nicknameSchema,
})
