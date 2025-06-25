'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { createVote } from '@/lib/api/vote'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createVoteAction = async (state: { code: string } = { code: '' }) => {
  const session = await auth()
  if (!session) redirect('/login')

  try {
    await createVote(session.accessToken)
    revalidatePath('/admin')
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
