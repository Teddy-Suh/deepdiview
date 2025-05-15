import { BasePaginationParams, PaginatedResponse, RatingDistribution, Review } from './common'

// API 타입
// 특정 영화 상세정보 조회
export type GetMovieResponse = Movie

// 영화 제목으로 상세정보 조회
export type GetSearchedMoviesParams = BasePaginationParams & {
  title?: string
}
export type GetSearchedMoviesResponse = PaginatedResponse<Movie>

// 넷플릭스 인기도 탑20의 영화 리스트 조회
export type GetPopularMoviesResponse = Movie[]

// 보조 타입
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  runtime: number | null
  popularity: number
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
  genre_names: string[]
  myReview: Review | null
  ratingStats: {
    ratingAverage: number
    ratingDistribution: RatingDistribution
  }
  available: boolean
}
