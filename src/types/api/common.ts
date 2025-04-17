export interface BaseUser {
  userId: number
  email: string
  nickname: string
  profileImageUrl: string | null
  role: 'USER' | 'ADMIN'
  accessToken: string
  refreshToken: string
}

export type CertificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | null

export type CertificationRejectionReason =
  | 'OTHER_MOVIE_IMAGE'
  | 'WRONG_IMAGE'
  | 'UNIDENTIFIABLE_IMAGE'

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
  comments: Comment[]
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
export type ImgRequest = FormData

export type SortDirection = 'asc' | 'desc'
