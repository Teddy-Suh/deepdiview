// 알림 타입 코드
export const NOTIFICATION_TYPES = {
  NEW_LIKE: 'NEW_LIKE',
  NEW_COMMENT: 'NEW_COMMENT',
  CERTIFICATION_APPROVED: 'CERTIFICATION_APPROVED',
  CERTIFICATION_REJECTED: 'CERTIFICATION_REJECTED',
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  [NOTIFICATION_TYPES.NEW_LIKE]: '❤️',
  [NOTIFICATION_TYPES.NEW_COMMENT]: '💬',
  [NOTIFICATION_TYPES.CERTIFICATION_APPROVED]: '✅',
  [NOTIFICATION_TYPES.CERTIFICATION_REJECTED]: '❌',
}

export function getNotificationTypesLabel(type: NotificationType): string {
  return NOTIFICATION_LABELS[type]
}

export const NOTIFICATION_LINKS: Record<NotificationType, (id: number) => string | (() => string)> =
  {
    [NOTIFICATION_TYPES.NEW_LIKE]: (id) => `/reviews/${id}`,
    [NOTIFICATION_TYPES.NEW_COMMENT]: (id) => `/reviews/${id}`,
    [NOTIFICATION_TYPES.CERTIFICATION_APPROVED]: () => '/board',
    [NOTIFICATION_TYPES.CERTIFICATION_REJECTED]: () => '/profile/submit-certification',
  }

export function getNotificationLink(type: NotificationType, relatedId: number | null): string {
  const fn = NOTIFICATION_LINKS[type]
  return relatedId ? (fn as (id: number) => string)(relatedId) : (fn as () => string)()
}
