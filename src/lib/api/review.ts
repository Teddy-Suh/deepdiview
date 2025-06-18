import {
  CreateReviewRequest,
  CreateReviewResponse,
  GetLatestReviewsResponse,
  GetReviewResponse,
  GetReviewsParams,
  GetReviewsResponse,
  UpdateReviewRequest,
  UpdateReviewResponse,
} from '@/types/api/review'
import { apiClient } from '../apiClient'
import { toQueryString } from '../../utils/query'

// 특정 리뷰 조회
export async function getReview(
  id: string,
  withAuth?: boolean,
  token?: string
): Promise<GetReviewResponse> {
  return apiClient<GetReviewResponse>(`/reviews/${id}`, {
    withAuth,
    token,
  })
}

// 리뷰글 수정
export async function updateReview(
  id: string,
  token: string,
  body: UpdateReviewRequest
): Promise<UpdateReviewResponse> {
  return apiClient<UpdateReviewResponse, UpdateReviewRequest>(`/reviews/${id}`, {
    method: 'PUT',
    body,
    withAuth: true,
    token,
  })
}

// 리뷰글 삭제
export async function deleteReview(id: string, token: string): Promise<null> {
  return apiClient<null>(`/reviews/${id}`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}

// 리뷰글 작성
export async function createReview(
  token: string,
  body: CreateReviewRequest
): Promise<CreateReviewResponse> {
  return apiClient<CreateReviewResponse, CreateReviewRequest>(`/reviews`, {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}

// 좋아요
export async function toggleLike(id: string, token: string): Promise<null> {
  return apiClient<null>(`/reviews/like/${id}`, {
    method: 'POST',
    withAuth: true,
    token,
  })
}

// 특정 영화에 대한 리뷰 조회 (쿼리)
export async function getReviews(
  id: string,
  withAuth?: boolean,
  token?: string,
  params?: GetReviewsParams
): Promise<GetReviewsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetReviewsResponse>(`/reviews/movie/${id}${query}`, {
    withAuth,
    token,
  })
}

// 최신 리뷰 조회
export async function getLatestReviews(
  withAuth?: boolean,
  token?: string,
  params?: GetReviewsParams
): Promise<GetLatestReviewsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetLatestReviewsResponse>(`/reviews/latest${query}`, {
    withAuth,
    token,
  })
}
