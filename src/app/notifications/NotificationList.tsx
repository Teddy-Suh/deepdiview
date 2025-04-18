'use client'

import ReadAllButton from './ReadAllButton'
import NotificationItem from './NotificationItem'
import { Notification } from '@/types/api/notification'
import { useState } from 'react'

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [notificationList, setNotificationList] = useState(notifications)

  const handleReadAll = () => {
    setNotificationList((prev) =>
      prev.map((notificationItem) => ({
        ...notificationItem,
        read: true,
      }))
    )
  }

  const handleRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((notificationItem) =>
        notificationItem.notificationId === id
          ? { ...notificationItem, read: true }
          : notificationItem
      )
    )
  }

  return (
    <>
      <ReadAllButton onReadAll={handleReadAll} />
      {notificationList.map((notificationItem) => (
        <NotificationItem
          key={notificationItem.notificationId}
          notification={notificationItem}
          onRead={handleRead}
        />
      ))}
    </>
  )
}
