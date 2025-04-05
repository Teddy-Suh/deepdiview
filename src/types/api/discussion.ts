import { Review } from './common'

// API 타입

// 인증승인된 사용자의 토론 게시판 리뷰 작성
export interface CreateBoardReviewRequest {
  title: string
  content: string
  rating: number
}

export type CreateBoardReviewResponse = Review

// 이번주 토론 영화(= 지난주 1위 영화) id 조회
export interface GetThisWeekMovieIdResponse {
  tmdbId: number
}

// 일요일인지 여부 T/F
export interface GetIsSundayResponse {
  isSunday: boolean
}
