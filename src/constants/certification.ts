// 인증 상태
export const CERTIFICATION_STATUS = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
  NONE: 'NONE',
} as const

export type CertificationStatus = (typeof CERTIFICATION_STATUS)[keyof typeof CERTIFICATION_STATUS]

export const CERTIFICATION_STATUS_LABELS_MAP: Record<
  CertificationStatus,
  { emoji: string; text: string }
> = {
  APPROVED: { emoji: '🟢', text: '승인' },
  PENDING: { emoji: '🟡', text: '대기' },
  REJECTED: { emoji: '🔴', text: '거절' },
  NONE: { emoji: '', text: '인증 하기' },
}

export function getCertificationStatusLabel(status: CertificationStatus): string {
  const { emoji, text } = CERTIFICATION_STATUS_LABELS_MAP[status]
  return `${emoji} ${text}`
}

export function getCertificationStatusBtnLabel(status: CertificationStatus | undefined): string {
  if (!status) return '전체'
  return CERTIFICATION_STATUS_LABELS_MAP[status].text
}

// 인증 거절 사유
export const CERTIFICATION_REJECTION_REASONS = {
  UNIDENTIFIABLE_IMAGE: 'UNIDENTIFIABLE_IMAGE',
  WRONG_IMAGE: 'WRONG_IMAGE',
  OTHER_MOVIE_IMAGE: 'OTHER_MOVIE_IMAGE',
} as const

export type CertificationRejectionReason =
  (typeof CERTIFICATION_REJECTION_REASONS)[keyof typeof CERTIFICATION_REJECTION_REASONS]

export const CERTIFICATION_REJECTION_REASON_LABELS: Record<CertificationRejectionReason, string> = {
  UNIDENTIFIABLE_IMAGE: '식별 불가 이미지',
  WRONG_IMAGE: '잘못된 이미지',
  OTHER_MOVIE_IMAGE: '다른 영화 이미지',
}

export function getRejectionReasonLabel(reason: CertificationRejectionReason): string {
  return CERTIFICATION_REJECTION_REASON_LABELS[reason]
}
