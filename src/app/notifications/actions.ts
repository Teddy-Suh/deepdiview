'use server'

import { auth } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { readAllNotifications, readNotification } from '@/lib/api/notification'
import { redirect } from 'next/navigation'

export const readNotificationAction = async (
  notificationId: string,
  state: {
    hasUnread: boolean | null
    code: string
  }
) => {
  const session = await auth()
  if (!session) redirect('/login')

  try {
    const { hasUnread } = await readNotification(notificationId, session.accessToken)
    return { ...state, code: COMMON_CODES.SUCCESS as string, hasUnread }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode as string }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const readAllNotificationsAction = async () => {
  const session = await auth()
  if (!session) redirect('/login')

  try {
    await readAllNotifications(session.accessToken)
    return { code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
