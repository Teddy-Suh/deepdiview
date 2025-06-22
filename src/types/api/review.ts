import { createReviewServerSchema } from '@/schemas/review/createReviewSchema'
import {
  BasePaginationParams,
  PaginatedResponse,
  PaginationParamsWithSort,
  Review,
  ReviewSortField,
  WriteReviewResponse,
} from './common'
import { z } from 'zod'
import { updateReviewServerSchema } from '@/schemas/review/updateReviewSchema'

// API 타입

// 특정 리뷰 조회
export type GetReviewResponse = Review

// 리뷰글 수정
export type UpdateReviewRequest = z.infer<typeof updateReviewServerSchema>
export type UpdateReviewResponse = WriteReviewResponse

// 리뷰글 삭제

// 리뷰글 작성
export type CreateReviewRequest = z.infer<typeof createReviewServerSchema>
export type CreateReviewResponse = WriteReviewResponse

// 좋아요

// 특정 영화에 대한 리뷰 조회
export type GetReviewsParams = PaginationParamsWithSort<ReviewSortField> & {
  certifiedFilter?: boolean
}
export type GetReviewsResponse = PaginatedResponse<Review>

// 최신 리뷰 조회
export type GetLatestReviewsParams = BasePaginationParams
export type GetLatestReviewsResponse = PaginatedResponse<Review>
