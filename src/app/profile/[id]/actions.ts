'use server'

import { auth, signOut } from '@/auth'
import { logout } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const signOutWithForm = async () => {
  try {
    const session = await auth()
    const accessToken = session?.accessToken
    if (accessToken) {
      await logout(accessToken)
    }
    await signOut({ redirect: false })
  } catch (error) {
    console.error(error)
    throw new Error('UNHANDLED_ERROR')
  }
  redirect('/')
}
