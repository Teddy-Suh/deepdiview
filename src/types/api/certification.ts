import {
  CertificationRejectionReason,
  CertificationStatus,
  ImgRequest,
  PaginationParamsWithSort,
} from './common'

// API 타입

// 인증샷 수정
export type UpdateCertificationRequest = ImgRequest
export type UpdateCertificationResponse = CertificationPendingResponse

// 인증샷 제출
export type CreateCertificationRequest = ImgRequest
export type CreateCertificationResponse = CertificationPendingResponse

// 인증샷 삭제

// 인증 승인/거절
export interface UpdateCertificationStatusRequest {
  approve: boolean
  rejectionReason?: CertificationRejectionReason
}

export type UpdateCertificationStatusResponse = Certification

// 인증샷 상태 확인
export type GetCertificationResponse = NullableCertification

// 인증 목록 조회
export type GetCertificationsParams = PaginationParamsWithSort<CertificationSortField> & {
  status?: CertificationStatus
  createdAt?: string
  nextCertificationId?: number
}
export interface GetCertificationsResponse {
  content: Certification[]
  hasNext: boolean
  nextCertificationId: number
  nextCreatedAt: string
}

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
  rejectionReason: CertificationRejectionReason
}
export type NullableCertification = {
  [K in keyof Certification]: Certification[K] | null
}
export type CertificationSortField = 'createdAt' | 'status'
