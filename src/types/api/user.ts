import { z } from 'zod'
import {
  BaseUser,
  CertificationRejectionReason,
  CertificationStatus,
  Comment,
  ImgRequest,
  PaginationParamsWithSort,
  PaginatedResponse,
  Review,
  ReviewSortField,
  BasePaginationParams,
  RatingDistribution,
} from './common'
import { updatePasswordSchema } from '@/schemas/auth/updatePasswordSchema'
import { deleteAccountSchema } from '@/schemas/auth/deleteAccountSchema'
import { registerSchema } from '@/schemas/auth/registerSchema'
import { loginSchema } from '@/schemas/auth/loginSchema'

// API 타입

// 프로필사진 등록/수정
export type UpdateProfileImgRequest = ImgRequest
export type UpdateProfileImgResponse = ProfileImgResponse

// 프로필사진 삭제
export type DeleteProfileImgResponse = ProfileImgResponse

// 비밀번호 수정
export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>

// 닉네임 수정
export interface UpdateNicknameRequest {
  newNickname: string
}

export interface UpdateNicknameResponse {
  updatedNickname: string
}

// 내 정보 확인
export type GetMyProfileResponse = ProfileResponse

// 회원탈퇴
export type DeleteMyProfileRequest = z.infer<typeof deleteAccountSchema>

// 한줄소개 설정/수정
export interface UpdateIntroRequest {
  oneLineIntro: string
}
export interface UpdateIntroResponse {
  updatedOneLineIntro: string | null
}

// 회원가입
export type RegisterRequest = z.infer<typeof registerSchema>

// 리프레시 토큰으로 엑세스 토큰 재발급
export interface RefreshAccessTokenResponse {
  newAccessToken: string
}

// 로그인
export type LoginRequest = z.infer<typeof loginSchema>
export type LoginResponse = BaseUser

// 다른 유저 정보 확인
export type GetUserProfileResponse = ProfileResponse

// 특정 사용자가 작성한 리뷰 조회
export type GetUserReviewsParams = PaginationParamsWithSort<ReviewSortField>
export type GetUserReviewsResponse = PaginatedResponse<Review>

// 특정 사용자가 작성한 댓글 조회
export type GetUserCommentsParams = BasePaginationParams
export type GetUserCommentsResponse = PaginatedResponse<Comment>

// 로그아웃

// 보조 타입
export interface ProfileResponse {
  nickname: string
  email: string | null
  profileImageUrl: string
  oneLineIntro: string | null
  reviewCount: number
  commentCount: number
  ratingStats: {
    ratingAverage: number
    ratingDistribution: RatingDistribution
  }
  certificationStatus: CertificationStatus
  rejectionReason: CertificationRejectionReason | null
}

export interface ProfileImgResponse {
  profileImageUrl: string
}
