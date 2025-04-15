import {
  CreateProfileImgRequest,
  CreateProfileImgResponse,
  DeleteMyProfileRequest,
  GetMyProfileResponse,
  GetUserCommentsParams,
  GetUserCommentsResponse,
  GetUserProfileResponse,
  GetUserReviewsParams,
  GetUserReviewsResponse,
  LoginRequest,
  LoginResponse,
  RefreshAccessTokenResponse,
  RegisterRequest,
  UpdateIntroRequest,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
  UpdatePasswordRequest,
  UpdateProfileImgRequest,
  UpdateProfileImgResponse,
} from '@/types/api/user'
import { apiClient } from '../apiClient'
import { toQueryString } from '../utils/query'

// 프로필사진 수정
export async function updateProfileImg(
  token: string,
  body: UpdateProfileImgRequest
): Promise<UpdateProfileImgResponse> {
  return apiClient<UpdateProfileImgResponse, UpdateProfileImgRequest>(`/users/profile-image`, {
    method: 'PUT',
    body,
    withAuth: true,
    token,
  })
}

// 프로필사진 등록
export async function createProfileImg(
  token: string,
  body: CreateProfileImgRequest
): Promise<CreateProfileImgResponse> {
  return apiClient<CreateProfileImgResponse, CreateProfileImgRequest>(`/users/profile-image`, {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}

// 프로필사진 삭제
export async function deleteProfileImg(token: string): Promise<null> {
  return apiClient<null>(`/users/profile-image`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}

// 비밀번호 수정
export async function updatePassword(token: string, body: UpdatePasswordRequest): Promise<null> {
  return apiClient<null, UpdatePasswordRequest>(`/users/me/password`, {
    method: 'PUT',
    body,
    withAuth: true,
    token,
  })
}

// 닉네임 수정
export async function updateNickname(
  token: string,
  body: UpdateNicknameRequest
): Promise<UpdateNicknameResponse> {
  return apiClient<UpdateNicknameResponse, UpdateNicknameRequest>(`/users/me/nickname`, {
    method: 'PUT',
    body,
    withAuth: true,
    token,
  })
}

// 내 정보 확인
export async function getMyProfile(token: string): Promise<GetMyProfileResponse> {
  return apiClient<GetMyProfileResponse>(`/users/me`, {
    withAuth: true,
    token,
  })
}

// 회원탈퇴
export async function deleteMyProfile(token: string, body: DeleteMyProfileRequest): Promise<null> {
  return apiClient<null, DeleteMyProfileRequest>(`/users/me`, {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}

// 한줄소개 설정/수정
export async function updateIntro(token: string, body: UpdateIntroRequest): Promise<null> {
  return apiClient<null, UpdateIntroRequest>(`/users/me/intro`, {
    method: 'PUT',
    body,
    withAuth: true,
    token,
  })
}

// 회원가입
export async function register(body: RegisterRequest): Promise<null> {
  return apiClient<null, RegisterRequest>('/users/signup', {
    method: 'POST',
    body,
  })
}

// 리프레시 토큰으로 엑세스 토큰 재발급
export async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshAccessTokenResponse> {
  return apiClient<RefreshAccessTokenResponse>('/users/reissue-access-token', {
    method: 'POST',
    withAuth: true,
    token: refreshToken,
  })
}

// 로그인
export async function login(body: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse, LoginRequest>('/users/login', {
    method: 'POST',
    body,
  })
}

// 다른 유저 정보 확인
export async function getUserProfile(token: string, id: string): Promise<GetUserProfileResponse> {
  return apiClient<GetUserProfileResponse>(`/users/${id}`, {
    withAuth: true,
    token,
  })
}

// 특정 사용자가 작성한 리뷰 조회
export async function getUserReviews(
  token: string,
  id: string,
  params?: GetUserReviewsParams
): Promise<GetUserReviewsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetUserReviewsResponse>(`/users/${id}/reviews${query}`, {
    withAuth: true,
    token,
  })
}

// 특정 사용자가 작성한 댓글 조회
export async function getUserComments(
  token: string,
  id: string,
  params?: GetUserCommentsParams
): Promise<GetUserCommentsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetUserCommentsResponse>(`/users/${id}/comments${query}`, {
    withAuth: true,
    token,
  })
}

// 로그아웃
export async function logout(token: string): Promise<null> {
  return apiClient<null>(`/users/logout`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}
