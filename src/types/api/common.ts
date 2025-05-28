export interface BaseUser {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string
  role: 'USER' | 'ADMIN'
  accessToken: string
  refreshToken: string
}

export type CertificationStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | null

export type CertificationRejectionReason =
  | 'OTHER_MOVIE_IMAGE'
  | 'WRONG_IMAGE'
  | 'UNIDENTIFIABLE_IMAGE'

export interface BasePaginationParams {
  page?: number
  size?: number
}

export interface PaginationParamsWithSort<T extends string> extends BasePaginationParams {
  sort?: `${T},${SortDirection}`
}

export interface PaginatedResponse<T> {
  content: T[]
  number: number
  size: number
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface Review {
  reviewId: number
  userId: number
  nickname: string
  profileImageUrl: string | null
  reviewTitle: string
  reviewContent: string
  rating: number
  createdAt: string
  updatedAt: string
  commentCount: number
  likeCount: number
  likedByUser: boolean
  tmdbId: number
  movieTitle: string
  posterPath: string
  certified: boolean
}

export interface Comment {
  id: number
  reviewId: number
  userId: number
  userNickname: string
  profileImageUrl: string
  content: string
  createdAt: string
  updatedAt: string
}

export type ClientComment = Comment & {
  optimisticStatus?: 'creating' | 'updating' | 'deleting'
}

export type ImgRequest = FormData

export type ReviewSortField = 'createdAt' | 'likeCount' | 'rating'

export type SortDirection = 'asc' | 'desc'

export type Rating = '0.5' | '1.0' | '1.5' | '2.0' | '2.5' | '3.0' | '3.5' | '4.0' | '4.5' | '5.0'

export type RatingDistribution = {
  [key in Rating]: number
}
