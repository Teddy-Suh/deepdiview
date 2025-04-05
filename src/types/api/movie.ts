// API 타입

import { Review } from './common'

// 특정 영화 상세정보 조회
export interface GetMovieResponse {
  id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  popularity: number
  poster_path: string
  backdrop_path: string
  genre_ids: number[]
  genre_names: string[]
  reviews: Review[]
  myReview: Review | null
}

// 영화 제목으로 상세정보 조회
export type GetSearchedMoviesResponse = GetMovieResponse[]

// 넷플릭스 인기도 탑20의 영화 리스트 조회
export type GetPopularMoviesResponse = GetMovieResponse[]
