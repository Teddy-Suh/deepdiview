// 리뷰 관련 에러 코드
export const REVIEW_CODES = {
  REVIEW_NOT_FOUND: 'REVIEW_NOT_FOUND',
  ALREADY_COMMITTED_REVIEW: 'ALREADY_COMMITTED_REVIEW',
} as const

export type ReviewCode = (typeof REVIEW_CODES)[keyof typeof REVIEW_CODES]

export const REVIEW_MESSAGES: Record<ReviewCode, string> = {
  [REVIEW_CODES.REVIEW_NOT_FOUND]: '존재하지 않는 리뷰입니다.',
  [REVIEW_CODES.ALREADY_COMMITTED_REVIEW]: '이미 해당 영화에 대한 리뷰를 작성했습니다.',
}
