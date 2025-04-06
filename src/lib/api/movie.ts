import {
  GetMovieResponse,
  GetPopularMoviesResponse,
  GetSearchedMoviesResponse,
} from '@/types/api/movie'
import { apiClient } from '../apiClient'

// 특정 영화 상세정보 조회
export async function getMovie(id: string): Promise<GetMovieResponse> {
  return apiClient<GetMovieResponse>(`/movies/${id}`)
}

// 영화 제목으로 상세정보 조회
export async function getSearchedMovies(title: string): Promise<GetSearchedMoviesResponse> {
  return apiClient<GetSearchedMoviesResponse>(
    `/movies/search/list?title=${encodeURIComponent(title)}`
  )
}

// 넷플릭스 인기도 탑20의 영화 리스트 조회
export async function getPopularMovies(): Promise<GetPopularMoviesResponse> {
  return apiClient<GetPopularMoviesResponse>('/movies/popularity/top20')
}
