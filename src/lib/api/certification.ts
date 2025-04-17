import {
  CreateCertificationRequest,
  CreateCertificationResponse,
  GetCertificationResponse,
  GetCertificationsParams,
  GetCertificationsResponse,
  UpdateCertificationRequest,
  UpdateCertificationResponse,
  UpdateCertificationStatusRequest,
  UpdateCertificationStatusResponse,
} from '@/types/api/certification'
import { apiClient } from '../apiClient'
import { toQueryString } from '../utils/query'

// 인증샷 수정
export async function updateCertification(
  token: string,
  formData: UpdateCertificationRequest
): Promise<UpdateCertificationResponse> {
  return apiClient<UpdateCertificationResponse, UpdateCertificationRequest>(`/certifications`, {
    method: 'PUT',
    body: formData,
    isFormData: true,
    withAuth: true,
    token,
  })
}

// 인증샷 제출
export async function createCertification(
  token: string,
  formData: CreateCertificationRequest
): Promise<CreateCertificationResponse> {
  return apiClient<CreateCertificationResponse, CreateCertificationRequest>(`/certifications`, {
    method: 'POST',
    body: formData,
    isFormData: true,
    withAuth: true,
    token,
  })
}

// 인증샷 삭제
export async function deleteCertification(token: string) {
  return apiClient(`/certifications`, {
    method: 'DELETE',
    withAuth: true,
    token,
  })
}

// 인증 승인/거절
export async function updateCertificationStatus(
  id: string,
  token: string,
  body: UpdateCertificationStatusRequest
): Promise<UpdateCertificationStatusResponse> {
  return apiClient<UpdateCertificationStatusResponse, UpdateCertificationStatusRequest>(
    `/certifications/admin/proceeding/${id}`,
    {
      method: 'POST',
      body,
      withAuth: true,
      token,
    }
  )
}

// 인증샷 상태 확인
export async function getCertification(token: string): Promise<GetCertificationResponse> {
  return apiClient<GetCertificationResponse>(`/certifications/me`, {
    withAuth: true,
    token,
  })
}

// 인증 목록 조회
export async function getCertifications(
  token: string,
  params?: GetCertificationsParams
): Promise<GetCertificationsResponse> {
  const query = params ? `?${toQueryString(params)}` : ''
  return apiClient<GetCertificationsResponse>(`/certifications/admin${query}`, {
    withAuth: true,
    token,
  })
}
