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

export interface PageableInfo {
  offset: number
  sort: SortInfo
  pageSize: number
  paged: boolean
  pageNumber: number
  unpaged: boolean
}

export interface SortInfo {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface PaginatedResponse<T> {
  totalElements: number
  totalPages: number
  size: number
  content: T[]
  number: number
  sort: SortInfo
  numberOfElements: number
  pageable: PageableInfo
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
