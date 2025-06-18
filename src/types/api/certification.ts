import { CertificationRejectionReason, CertificationStatus } from '@/constants/certification'
import { BasePaginationParams, CursorPaginatedResponse, ImgRequest } from './common'

// API 타입

// 유저
// 인증샷 상태 확인
export type GetCertificationResponse = UserCertification

// 인증샷 제출
export type CreateCertificationRequest = ImgRequest
export type CreateCertificationResponse = UserCertification

// 인증샷 수정
export type UpdateCertificationRequest = ImgRequest
export type UpdateCertificationResponse = UserCertification

// 인증샷 삭제

// 관리자
// 인증 목록 조회
export type GetCertificationsParams = BasePaginationParams & {
  status?: CertificationStatus
  createdAt?: string
  certificationId?: number
}
export type GetCertificationsResponse = CursorPaginatedResponse<AdminCertification>

// 인증 승인/거절
export interface UpdateCertificationStatusRequest {
  approve: boolean
  rejectionReason?: CertificationRejectionReason
}
export type UpdateCertificationStatusResponse = AdminCertification

// 보조 타입
export interface UserCertification {
  status: CertificationStatus
  certificationDetails: CertificationDetails | null
  userInformation: null
}

export interface AdminCertification {
  status: CertificationStatus
  certificationDetails: CertificationDetails
  userInformation: UserInformation
}

export interface CertificationDetails {
  id: number
  userId: number
  certificationUrl: string
  createdAt: string
  rejectionReason: CertificationRejectionReason
}

export interface UserInformation {
  userId: number
  userNickname: string
  profileImageUrl: string
}
