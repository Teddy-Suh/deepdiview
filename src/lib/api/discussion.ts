import {
  CreateBoardReviewRequest,
  CreateBoardReviewResponse,
  GetIsSundayResponse,
  GetThisWeekMovieIdResponse,
} from '@/types/api/discussion'
import { apiClient } from '../apiClient'

// 인증승인된 사용자의 토론 게시판 리뷰 작성
export async function createBoardReview(
  token: string,
  body: CreateBoardReviewRequest
): Promise<CreateBoardReviewResponse> {
  return apiClient<CreateBoardReviewResponse, CreateBoardReviewRequest>(`/discussions/reviews`, {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}

// 이번주 토론 영화(= 지난주 1위 영화) id 조회
export async function getThisWeekMovieId(): Promise<GetThisWeekMovieIdResponse> {
  return apiClient<GetThisWeekMovieIdResponse>('/discussions/this-week-movie')
}

// 일요일인지 여부 T/F
export async function getIsSunday(): Promise<GetIsSundayResponse> {
  return apiClient<GetIsSundayResponse>('/discussions/is-sunday')
}
