'use client'

import { useActionState, useEffect, useRef } from 'react'
import { readNotificationAction } from './actions'
import { Notification } from '@/types/api/notification'
import { getRelativeTime } from '@/utils/date'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { getNotificationLink, getNotificationTypesLabel } from '@/constants/notifications'
import Link from 'next/link'
import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import toast from 'react-hot-toast'

export default function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: number, hasUnread: boolean) => void
}) {
  const router = useRouter()
  const calledRef = useRef(false)
  const [state, formAction] = useActionState(
    readNotificationAction.bind(null, notification.notificationId.toString()),
    {
      hasUnread: null,
      code: '',
    }
  )

  const isNewNotification = Date.now() - new Date(notification.createdAt).getTime() < 1500
  const link = getNotificationLink(notification.notificationType, notification.relatedId)

  useEffect(() => {
    if (state.code === '' || state.hasUnread === null) return

    if (state.code === COMMON_CODES.SUCCESS && !calledRef.current) {
      calledRef.current = true
      onRead(notification.notificationId, state.hasUnread)
      router.push(link)
      return
    }

    if (state.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
    }
  }, [link, notification.notificationId, onRead, router, state])

  const content = (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-full p-2',
        notification.read ? 'bg-base-300' : 'bg-primary/20',
        isNewNotification && 'animate-get-new-notification'
      )}
    >
      <div className='bg-base-100 flex aspect-square w-10 items-center justify-center rounded-full text-2xl'>
        {getNotificationTypesLabel(notification.notificationType)}
      </div>
      <div className='text-start'>
        <p>{notification.message}</p>
        <p className='text-xs text-gray-400'>{getRelativeTime(notification.createdAt)}</p>
      </div>
    </div>
  )

  if (notification.read) return <Link href={link}>{content}</Link>

  return (
    <form action={formAction}>
      <button type='submit' disabled={notification.read} className='w-full'>
        {content}
      </button>
    </form>
  )
}
