'use client'

import { useEffect, useState } from 'react'
import { useNotificationStore } from '@/stores/useNotificationStore'
import clsx from 'clsx'
import { getNotificationTypesLabel } from '@/constants/notifications'

export default function NotificationBadge() {
  const hasUnread = useNotificationStore((state) => state.hasUnread)
  const sseNotification = useNotificationStore((state) => state.sseNotification)
  const [emoji, setEmoji] = useState<string | null>(null)

  useEffect(() => {
    if (!sseNotification) {
      setEmoji(null)
      return
    }
    setEmoji(getNotificationTypesLabel(sseNotification.notificationType))
  }, [sseNotification])

  if (!hasUnread) return null

  return (
    <>
      {hasUnread && (
        <div
          className={clsx(
            'badge badge-primary absolute -top-1 -right-1 aspect-square -translate-y-1/2 translate-x-1/2 rounded-full p-0! transition-all duration-200 md:top-0 md:-right-2',
            !emoji && 'badge-xs'
          )}
        >
          {emoji && <span className='animate-jump-in animate-duration-200'>{emoji}</span>}
        </div>
      )}
    </>
  )
}
