import { GetNotificationsParams, GetNotificationsResponse } from '@/types/api/notification'
import { apiClient } from '../apiClient'
import { toQueryString } from '../utils/query'

// 특정 알림 읽음처리
export async function readNotification(id: string, token: string): Promise<null> {
  return apiClient<null>(`/notifications/${id}/read`, {
    method: 'PUT',
    withAuth: true,
    token,
  })
}

// 전체 알림 읽음처리
export async function readAllNotifications(token: string): Promise<null> {
  return apiClient<null>(`/notifications/read-all`, {
    method: 'PUT',
    withAuth: true,
    token,
  })
}

// 알림 목록 조회
export async function getNotifications(
  token: string,
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetNotificationsResponse>(`/notifications${query}`, {
    withAuth: true,
    token,
  })
}
