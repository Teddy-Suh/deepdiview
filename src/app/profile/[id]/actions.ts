'use server'

import { auth, signOut } from '@/auth'
import { apiClient } from '@/lib/apiClient'
import { redirect } from 'next/navigation'

export const signOutWithForm = async () => {
  try {
    const session = await auth()
    const accessToken = session?.accessToken

    await apiClient('/users/logout', {
      method: 'DELETE',
      withAuth: true,
      token: accessToken,
    })

    await signOut({ redirect: false })
  } catch (error) {
    console.error(error)
    throw new Error('UNHANDLED_ERROR')
  }
  redirect('/')
}
