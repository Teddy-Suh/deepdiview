import { Movie } from './movie'

// API 타입
// 투표 생성

// 현재 진행중인 투표에 참여하기
export interface ParticipateVoteRequest {
  tmdbId: number
}

// 현재 진행중인 투표 결과 확인
export type GetVoteResultResponse = VoteResponse

// 지난주 투표 전체 결과 조회
export type GetVoteLatestResultResponse = VoteResponse

// 현재 진행중인 투표에 참여했는지 여부 T/F
export interface GetVoteParticipationStatusResponse {
  participated: boolean
}

// 현재 진행중인 투표의 선택지 조회
export type GetVoteOptionsResponse = VoteOptionsResponse

// 투표 삭제

// 보조 타입
export interface VoteResult {
  tmdbId: number
  voteCount: number
  rank: number
  lastVotedTime: string
  voted: boolean | null
}

export interface VoteResponse {
  results: VoteResult[]
}

export interface VoteOptionsResponse {
  tmdbIds: number[]
}

export type VoteResultWithMovie = Movie & VoteResult
