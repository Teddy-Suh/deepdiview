'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { USER_CODES } from '@/constants/messages/users'
import { updatePassword } from '@/lib/api/user'
import { updatePasswordSchema } from '@/schemas/auth/updatePasswordSchema'
import { redirect } from 'next/navigation'

export const updatePasswordAction = async (state: { code: string }, formData: FormData) => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  const userId = session.user?.userId

  const validatedFields = updatePasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    newConfirmPassword: formData.get('newConfirmPassword'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { currentPassword, newPassword, newConfirmPassword } = validatedFields.data

  try {
    await updatePassword(session.accessToken, {
      currentPassword,
      newPassword,
      newConfirmPassword,
    })
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
  redirect(`/profile/${userId}`)
}
