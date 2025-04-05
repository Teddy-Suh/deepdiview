// API 타입

// 투표 생성
export interface CreateVoteResponse {
  voteId: number
  title: string
  startDate: string
  endDate: string
  movieDetails: VoteMovie[]
}

// 현재 진행중인 투표에 참여하기
export interface ParticipateVoteRequest {
  tmdbId: number
}

export interface ParticipateVoteResponse {
  voteSuccess: boolean
  tmdbId: number
}

// 현재 진행중인 투표 결과 확인
export type GetVoteResultResponse = VoteResult

// 지난주 투표 전체 결과 조회
export type GetVoteLatestResultResponse = VoteResult

// 현재 진행중인 투표에 참여했는지 여부 T/F
export interface GetVoteParticipationStatusResponse {
  participated: boolean
}

// 현재 진행중인 투표의 선택지 조회
export interface GetVoteOptionsResponse {
  voteId: number
  tmdbIds: number[]
}

// 투표 삭제

// 보조 타입
export interface VoteMovie {
  tmdbId: number
  voteCount: number
  rank: number
  lastVotedTime: string
}

export interface VoteResult {
  voteId: number
  startDate: string
  endDate: string
  results: VoteMovie[]
  activating: boolean
}
