import { Comment, PaginationParamsWithSort } from './common'

// API 타입

// 댓글 수정
export type UpdateCommentRequest = CommentsRequest
export type UpdateCommentResponse = Comment

// 댓글 삭제

// 특정 리뷰에 달린 댓글 조회
export type GetCommentsParams = PaginationParamsWithSort<'CreatedAt'> & {
  createdAt?: string
  commentId?: number
}

export interface GetCommentsResponse {
  content: Comment[]
  nextCreatedAt: string
  nextId: number
  hasNext: boolean
}

// 댓글 작성
export type CreateCommentParams = GetCommentsParams
export type CreateCommentRequest = CommentsRequest
export type CreateCommentResponse = Comment

// 보조 타입
export interface CommentsRequest {
  content: string
}
