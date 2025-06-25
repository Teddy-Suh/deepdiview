'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { participateVote } from '@/lib/api/vote'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const participateVoteAction = async (
  state: { code: string } = { code: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session) redirect('/login')

  const tmdbId = formData.get('tmdbId') as string

  try {
    await participateVote(session.accessToken, {
      tmdbId: Number(tmdbId),
    })
    revalidatePath('/board')
    return { ...state }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
