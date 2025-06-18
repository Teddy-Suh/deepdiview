// 알림 타입
export const NOTIFICATION_TYPES = {
  NEW_LIKE: 'NEW_LIKE',
  NEW_COMMENT: 'NEW_COMMENT',
  CERTIFICATION_APPROVED: 'CERTIFICATION_APPROVED',
  CERTIFICATION_REJECTED: 'CERTIFICATION_REJECTED',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export const NOTIFICATION_TYPES_LABELS: Record<NotificationType, string> = {
  NEW_LIKE: '❤️',
  NEW_COMMENT: '💬',
  CERTIFICATION_APPROVED: '✅',
  CERTIFICATION_REJECTED: '❌',
}

export function getNotificationTypesLabel(type: NotificationType): string {
  return NOTIFICATION_TYPES_LABELS[type]
}

export const NOTIFICATION_LINK_MAP: Record<
  NotificationType,
  (id: number) => string | (() => string)
> = {
  NEW_LIKE: (id) => `/reviews/${id}`,
  NEW_COMMENT: (id) => `/reviews/${id}`,
  CERTIFICATION_APPROVED: () => '/board',
  CERTIFICATION_REJECTED: () => '/profile/submit-certification',
}

export function getNotificationLink(type: NotificationType, relatedId: number | null): string {
  const fn = NOTIFICATION_LINK_MAP[type]
  return relatedId ? (fn as (id: number) => string)(relatedId) : (fn as () => string)()
}
