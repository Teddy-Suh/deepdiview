import {
  GetMovieResponse,
  GetPopularMoviesResponse,
  GetSearchedMoviesParams,
  GetSearchedMoviesResponse,
} from '@/types/api/movie'
import { apiClient } from '../apiClient'
import { toQueryString } from '../../utils/query'

// 특정 영화 상세정보 조회
export async function getMovie(
  id: string,
  withAuth?: boolean,
  token?: string
): Promise<GetMovieResponse> {
  return apiClient<GetMovieResponse>(`/movies/${id}`, {
    withAuth,
    token,
  })
}

// 영화 제목으로 상세정보 조회
export async function getSearchedMovies(
  params?: GetSearchedMoviesParams
): Promise<GetSearchedMoviesResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetSearchedMoviesResponse>(`/movies/search/list${query}`)
}

// 넷플릭스 인기도 탑20의 영화 리스트 조회
export async function getPopularMovies(): Promise<GetPopularMoviesResponse> {
  return apiClient<GetPopularMoviesResponse>('/movies/popularity/top20')
}
