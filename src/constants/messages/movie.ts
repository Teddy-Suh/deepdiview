// 리뷰 관련 에러 코드
export const MOVIES_CODES = {
  MOVIE_NOT_FOUND: 'MOVIE_NOT_FOUND',
} as const

export type MovieCode = (typeof MOVIES_CODES)[keyof typeof MOVIES_CODES]

export const MOVIE_MESSAGES: Record<MovieCode, string> = {
  [MOVIES_CODES.MOVIE_NOT_FOUND]: '존재하지 않는 영화입니다.',
}
