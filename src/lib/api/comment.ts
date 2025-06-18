import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsParams,
  GetCommentsResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
} from '@/types/api/comment'
import { apiClient } from '../apiClient'
import { toQueryString } from '../../utils/query'

// 댓글 수정
export async function updateComment(
  reviewId: string,
  commentId: string,
  body: UpdateCommentRequest,
  token: string
): Promise<UpdateCommentResponse> {
  return apiClient<UpdateCommentResponse, UpdateCommentRequest>(
    `/reviews/${reviewId}/comments/${commentId}`,
    {
      method: 'PUT',
      body,
      withAuth: true,
      token,
    }
  )
}

// 댓글 삭제
export async function deleteComment(
  reviewId: string,
  commentId: string,
  token: string
): Promise<null> {
  return apiClient<null>(`/reviews/${reviewId}/comments/${commentId}`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}

// 특정 리뷰에 달린 댓글 조회
export async function getComments(
  reviewId: string,
  params?: GetCommentsParams
): Promise<GetCommentsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetCommentsResponse>(`/reviews/${reviewId}/comments${query}`)
}

// 댓글 작성
export async function createComment(
  reviewId: string,
  token: string,
  body: CreateCommentRequest
): Promise<CreateCommentResponse> {
  return apiClient<CreateCommentResponse, CreateCommentRequest>(`/reviews/${reviewId}/comments`, {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}
