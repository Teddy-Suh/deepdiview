'use client'

import { useEffect } from 'react'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useSession } from '@/providers/providers'

export default function SSEClient() {
  const session = useSession()

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

        switch (data.type) {
          case 'like':
            console.log('좋아요 알림:', data.message)
            break
          case 'comment':
            console.log('댓글 알림:', data.message)
            break
          case 'certification':
            console.log('인증 상태 변경 알림:', data.message)
            break
          default:
            console.warn('알 수 없는 타입의 알림:', data)
        }
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
      eventSource.close()
    }
  }, [session])

  return null
}
