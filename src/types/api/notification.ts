// API 타입
// 특정 알림 읽음처리

// 전체 알림 읽음처리

// 알림 목록 조회
export type GetNotificationsResponse = Notification[]

// 보조 타입
export interface Notification {
  notificationId: number
  message: string
  createdAt: string
  read: boolean
}
