'use client'

import ReadAllButton from './ReadAllButton'
import NotificationItem from './NotificationItem'
import { Notification } from '@/types/api/notification'
import { useEffect, useRef, useState } from 'react'
import { getNotifications } from '@/lib/api/notification'
import { Session } from 'next-auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { useNotificationStore } from '@/stores/useNotificationStore'

export default function NotificationList({ session }: { session: Session }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isInitialFetching, setIsInitialFetching] = useState(true)
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [page, setPage] = useState(0)
  const [createdAt, setCreatedAt] = useState('')
  const [notificationId, setNotificationId] = useState<number>()

  const loaderRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  const setHasUnread = useNotificationStore((state) => state.setHasUnread)
  const sseNotification = useNotificationStore((state) => state.sseNotification)

  const handleReadAll = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
    setHasUnread(false)
  }

  const handleRead = (id: number, hasUnread: boolean) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === id ? { ...notification, read: true } : notification
      )
    )
    setHasUnread(hasUnread)
  }

  useEffect(() => {
    const target = loaderRef.current
    if (!target || !hasNext) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true
          setIsFetching(true)

          const res = await getNotifications(session.accessToken, {
            page,
            size: 15,
            createdAt,
            notificationId,
          })
          setNotifications((prev) => [...prev, ...res.content])
          setPage((prev) => prev + 1)
          setHasNext(res.hasNext)
          setCreatedAt(res.nextCreatedAt)
          setNotificationId(res.nextId)

          setIsFetching(false)
          isFetchingRef.current = false
        }
        if (page === 0) setIsInitialFetching(false)
      },
      {
        threshold: 0.3,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [createdAt, hasNext, notificationId, page, session.accessToken])

  // 알림 페이지에서 SSE 알림오면 제일 위에 넣기
  useEffect(() => {
    if (page === 0 || !sseNotification) return

    setNotifications((prev) => {
      // 중복 방지
      const alreadyExists = prev.some(
        (item) => item.notificationId === sseNotification.notificationId
      )
      if (alreadyExists) return prev

      // 맨 앞에 추가
      return [sseNotification, ...prev]
    })
  }, [page, sseNotification])

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>알림</h2>
        <ReadAllButton onReadAll={handleReadAll} />
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='hidden h-16 items-center justify-between md:flex'>
          <h2 className='flex-1 text-xl font-semibold'>알림</h2>
          <ReadAllButton onReadAll={handleReadAll} />
        </div>
        <ul className='space-y-2'>
          {isInitialFetching ? (
            <>
              {Array.from({ length: 15 }).map((_, i) => (
                <li key={i} className='skeleton h-14 w-full rounded-2xl' />
              ))}
            </>
          ) : (
            <>
              {notifications.map((notification) => (
                <li key={notification.notificationId}>
                  <NotificationItem notification={notification} onRead={handleRead} />
                </li>
              ))}
            </>
          )}
        </ul>

        {isFetching && (
          <div className='mt-2 w-full text-center md:mt-3'>
            <span className='loading loading-ring loading-xl text-primary' />
          </div>
        )}
        {hasNext && <div ref={loaderRef} className='h-1 w-full opacity-0' />}
      </div>
    </>
  )
}
