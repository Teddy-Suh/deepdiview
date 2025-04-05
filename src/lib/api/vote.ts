import {
  CreateVoteResponse,
  GetVoteLatestResultResponse,
  GetVoteOptionsResponse,
  GetVoteParticipationStatusResponse,
  GetVoteResultResponse,
  ParticipateVoteRequest,
  ParticipateVoteResponse,
} from '@/types/api/vote'
import { apiClient } from '../apiClient'

// 투표 생성
export async function createVote(token: string): Promise<CreateVoteResponse> {
  return apiClient<CreateVoteResponse>(`/votes`, {
    method: 'POST',
    withAuth: true,
    token,
  })
}

// 현재 진행중인 투표에 참여하기
export async function participateVote(
  token: string,
  body: ParticipateVoteRequest
): Promise<ParticipateVoteResponse> {
  return apiClient<ParticipateVoteResponse, ParticipateVoteRequest>('/votes/participate', {
    method: 'POST',
    body,
    withAuth: true,
    token,
  })
}

// 현재 진행중인 투표 결과 확인
export async function getVoteResult(): Promise<GetVoteResultResponse> {
  return apiClient<GetVoteResultResponse>(`/votes/result`)
}

// 지난주 투표 전체 결과 조회
export async function getVoteLatestResult(): Promise<GetVoteLatestResultResponse> {
  return apiClient<GetVoteLatestResultResponse>(`/votes/result/latest`)
}

// 현재 진행중인 투표에 참여했는지 여부 T/F
export async function getVoteParticipationStatus(
  token: string
): Promise<GetVoteParticipationStatusResponse> {
  return apiClient<GetVoteParticipationStatusResponse>(`/votes/participation-status`, {
    withAuth: true,
    token,
  })
}

// 현재 진행중인 투표의 선택지 조회
export async function getVoteOptions(token: string): Promise<GetVoteOptionsResponse> {
  return apiClient<GetVoteOptionsResponse>(`/votes/options`, {
    withAuth: true,
    token,
  })
}

// 투표 삭제
export async function deleteVote(id: string, token: string): Promise<null> {
  return apiClient<null>(`/votes/${id}`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}
