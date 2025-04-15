import {
  BaseUser,
  CertificationRejectionReason,
  CertificationStatus,
  Comment,
  PaginatedResponse,
  Review,
  SortDirection,
} from './common'

// API 타입

// 프로필사진 수정
export type UpdateProfileImgRequest = ProfileImgRequest
export type UpdateProfileImgResponse = ProfileImgResponse

// 프로필사진 등록
export type CreateProfileImgRequest = ProfileImgRequest
export type CreateProfileImgResponse = ProfileImgResponse

// 프로필사진 삭제

// 비밀번호 수정
export interface UpdatePasswordRequest {
  newPassword: string
  newConfirmPassword: string
}

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
export interface DeleteMyProfileRequest {
  password: string
}

// 한줄소개 설정/수정
export interface UpdateIntroRequest {
  oneLineIntro: string
}
export interface UpdateIntroResponse {
  updatedOneLineIntro: string | null
}

// 회원가입
export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  nickname: string
}

// 리프레시 토큰으로 엑세스 토큰 재발급
export interface RefreshAccessTokenResponse {
  newAccessToken: string
}

// 로그인
export interface LoginRequest {
  email: string
  password: string
}

export type LoginResponse = BaseUser

// 다른 유저 정보 확인
export type GetUserProfileResponse = ProfileResponse

// 특정 사용자가 작성한 리뷰 조회
export interface GetUserReviewsParams {
  page?: number
  size?: number
  sort?: `${ReviewSortField},${SortDirection}`
}

export type GetUserReviewsResponse = PaginatedResponse<Review>

// 특정 사용자가 작성한 댓글 조회
export interface GetUserCommentsParams {
  page?: number
  size?: number
  sort?: `${CommentSortField},${SortDirection}`
}

export type GetUserCommentsResponse = PaginatedResponse<Comment>

// 로그아웃

// 보조 타입
export interface ProfileResponse {
  nickname: string
  email: string
  profileImageUrl: string
  oneLineIntro: string | null
  reviewCount: number
  commentCount: number
  ratingDistribution: Partial<Record<Rating, number>>
  certificationStatus: CertificationStatus
  rejectionReason: CertificationRejectionReason | null
}

export type Rating = '0.5' | '1.0' | '1.5' | '2.0' | '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0'

export interface ProfileImgRequest {
  file: string
}
export interface ProfileImgResponse {
  profileImageUrl: string
}

export type ReviewSortField = 'createdAt' | 'likeCount' | 'rating'
// | 'updatedAt' | 'movieTitle' | 'user.nickname' | 'movie.tmdbId'

export type CommentSortField = 'createdAt'
// | 'id' | 'updatedAt' | 'user.nickname'
