'use server'

import { auth } from '@/auth'
import { readAllNotifications, readNotification } from '@/lib/api/notification'

export const readNotificationAction = async (
  notificationId: string,
  state: {
    hasUnread: boolean | null
    message: string
  }
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    const { hasUnread } = await readNotification(notificationId, session.accessToken)
    return { ...state, hasUnread }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'NOTIFICATION_NOT_FOUND':
        return { ...state, hasUnread: null, message: '존재하지 않는 알람입니다.' }
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}

export const readAllNotificationsAction = async () => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await readAllNotifications(session.accessToken)
    return { success: true }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}
