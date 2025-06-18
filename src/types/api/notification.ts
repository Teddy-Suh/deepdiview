import { NotificationType } from '@/constants/notifications'
import { BasePaginationParams, CursorPaginatedResponse } from './common'

// API 타입
// 알림 목록 조회
export type GetNotificationsParams = BasePaginationParams & {
  createdAt?: string
  notificationId?: number
}
export type GetNotificationsResponse = CursorPaginatedResponse<Notification>

// 안 읽은 알림 여부 확인용
export type GetUnreadExistsResponse = NotificationResponse

// 특정 알림 읽음처리
export type ReadNotificationResponse = NotificationResponse

// 전체 알림 읽음처리

// 보조 타입
export interface Notification {
  notificationId: number
  notificationType: NotificationType
  message: string
  relatedId: number | null
  createdAt: string
  read: boolean
}

export interface NotificationResponse {
  hasUnread: boolean
}
