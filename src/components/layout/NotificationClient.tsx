'use client'

import { useEffect, useRef } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { getUnreadExists } from '@/lib/api/notification'
import { Session } from 'next-auth'

export default function NotificationClient({ session }: { session: Session | null }) {
  const setHasUnread = useNotificationStore((state) => state.setHasUnread)
  const setSseNotification = useNotificationStore((state) => state.setSseNotification)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchHasUnread = async () => {
      try {
        const { hasUnread } = await getUnreadExists(session.accessToken)
        setHasUnread(hasUnread)
      } catch (error) {
        const errorCode = (error as Error).message
        if (process.env.NODE_ENV === 'development') {
          console.error('[NotificationClient] API_ERROR: ', errorCode)
        }
      }
    }

    fetchHasUnread()
  }, [session?.accessToken, setHasUnread])

  useEffect(() => {
    const userId = session?.user?.userId
    const token = session?.accessToken

    if (!userId || !token) {
      return
    }

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        heartbeatTimeout: 45000,
      }
    )

    // 연결 성공 (connect 이벤트)
    eventSource.addEventListener('connect', () => {})

    // 핑 수신 (ping 이벤트)
    eventSource.addEventListener('ping', () => {})

    // 알림 수신
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setHasUnread(true)
        setSseNotification(data)

        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          setSseNotification(null)
          timerRef.current = null
        }, 2000)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[NotificationClient] SSE_MESSAGE_Error: ', error)
        }
      }
    }

    // 에러 처리
    eventSource.onerror = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[NotificationClient] SSE_CONNECTION_ERROR: ', error)
      }
    }

    // 언마운트 시 연결 종료
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      eventSource.close()
    }
  }, [session?.user?.userId, session?.accessToken, setHasUnread, setSseNotification])

  return null
}
