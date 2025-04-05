import {
  CertificationRejectionReason,
  CertificationStatus,
  PaginatedResponse,
  SortDirection,
} from './common'

// API 타입

// 인증샷 수정
export interface UpdateCertificationRequest {
  file: string
}
export type UpdateCertificationResponse = CertificationPendingResponse

// 인증샷 제출
export interface CreateCertificationRequest {
  file: string
}
export type CreateCertificationResponse = CertificationPendingResponse

// 인증샷 삭제

// 인증 승인/거절
export interface UpdateCertificationStatusRequest {
  approve: boolean
  rejectionReason?: CertificationRejectionReason
}

// 인증샷 상태 확인
export type GetCertificationResponse = Certification

// 인증 목록 조회
export interface GetCertificationsParams {
  status?: CertificationStatus
  page?: number
  size?: number
  sort?: `${SortField},${SortDirection}`
}
export type GetCertificationsResponse = PaginatedResponse<Certification>

// 보조 타입
export type CertificationPendingResponse = {
  id: number
  userId: number
  certificationUrl: string
  status: 'PENDING'
  createdAt: string
  rejectionReason: null
}
export interface Certification {
  id: number
  userId: number
  certificationUrl: string
  status: CertificationStatus
  createdAt: string
  rejectionReason: CertificationRejectionReason | null
}
export type SortField = 'id' | 'createdAt' | 'status'
