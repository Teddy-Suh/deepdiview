'use client'

import { useActionState, useEffect, useRef } from 'react'
import { readNotificationAction } from './actions'
import { Notification } from '@/types/api/notification'

export default function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: number) => void
}) {
  const [state, formAction] = useActionState(
    readNotificationAction.bind(null, notification.notificationId.toString()),
    {
      message: '',
    }
  )

  const calledRef = useRef(false)

  useEffect(() => {
    if (state.message === 'success' && !calledRef.current) {
      calledRef.current = true
      onRead(notification.notificationId)
    }
  }, [state.message, onRead, notification.notificationId])

  return (
    <form action={formAction}>
      <button
        className={`border-2 ${notification.read ? 'border-secondary' : 'border-primary'}`}
        type='submit'
        disabled={notification.read}
      >
        <p>{notification.createdAt}</p>
        <p>{notification.message}</p>
      </button>
    </form>
  )
}
