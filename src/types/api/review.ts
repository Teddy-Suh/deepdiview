import { PaginatedResponse, Review, SortDirection } from './common'

// API 타입

// 특정 리뷰 조회
export type GetReviewResponse = Review

// 리뷰글 수정
export interface UpdateReviewRequest {
  title: string
  content: string
  rating: number
}
export type UpdateReviewResponse = Review

// 리뷰글 삭제

// 리뷰글 작성
export interface CreateReviewRequest {
  tmdbId: number
  title: string
  content: string
  rating: number
}

export type CreateReviewResponse = Review

// 좋아요 204

// 특정 영화에 대한 리뷰 조회
export interface GetReviewsParams {
  certifiedFilter?: boolean
  page?: number
  size?: number
  sort?: `${SortField},${SortDirection}`
}

export type GetReviewsResponse = PaginatedResponse<Review>

// 최신 리뷰 3개 조회 (쿼리)
export type GetLatestReviewsResponse = Review[]

// 보조 타입
export type SortField = 'rating' | 'createdAt' | 'likeCount' | 'nickname'
