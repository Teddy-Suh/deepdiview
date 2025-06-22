'use server'

import { auth, signOut } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { USER_CODES } from '@/constants/messages/users'
import { deleteMyProfile } from '@/lib/api/user'
import { deleteAccountSchema } from '@/schemas/auth/deleteAccountSchema'
import { redirect } from 'next/navigation'

export const deleteMyProfileAction = async (state: { code: string }, formData: FormData) => {
  const session = await auth()
  if (!session) redirect('/')

  const validatedFields = deleteAccountSchema.safeParse({
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { password } = validatedFields.data

  try {
    await deleteMyProfile(session.accessToken, {
      password,
    })
    await signOut({ redirect: false })
  } catch (error) {
    const errorCode = (error as Error).message

    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case USER_CODES.NOT_VALID_PASSWORD:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
  redirect('/')
}
