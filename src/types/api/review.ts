import {
  BasePaginationParams,
  PaginatedResponse,
  PaginationParamsWithSort,
  Review,
  ReviewSortField,
} from './common'

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

// 좋아요

// 특정 영화에 대한 리뷰 조회
export type GetReviewsParams = PaginationParamsWithSort<ReviewSortField>
export type GetReviewsResponse = PaginatedResponse<Review>

// 최신 리뷰 조회
export type GetLatestReviewsParams = BasePaginationParams
export type GetLatestReviewsResponse = PaginatedResponse<Review>
