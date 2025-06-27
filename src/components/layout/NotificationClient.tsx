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
        console.warn('초기 알림 상태 확인 실패', error)
      }
    }

    fetchHasUnread()
  }, [session?.accessToken, setHasUnread])

  useEffect(() => {
    const userId = session?.user?.userId
    const token = session?.accessToken

    if (!userId || !token) {
      console.warn('SSE 구독 조건 부족 (userId 또는 token 없음)')
      return
    }

    console.log('SSE 구독 시도')

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
    eventSource.addEventListener('connect', (event) => {
      const data = (event as MessageEvent).data
      console.log('SSE 연결 성공', data)
    })

    // 핑 수신 (ping 이벤트)
    eventSource.addEventListener('ping', (event) => {
      const data = (event as MessageEvent).data
      console.log('핑 수신', data)
    })

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
        console.error('알림 파싱 실패:', error)
      }
    }

    // 에러 처리
    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류', error)
    }

    // 언마운트 시 연결 종료
    return () => {
      console.log('SSE 구독 종료')
      if (timerRef.current) clearTimeout(timerRef.current)
      eventSource.close()
    }
  }, [session?.user?.userId, session?.accessToken, setHasUnread, setSseNotification])

  return null
}
