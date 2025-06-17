'use server'

import { auth } from '@/auth'
import { updateCertificationStatus } from '@/lib/api/certification'
import { CertificationRejectionReason } from '@/types/api/common'
import { AdminCertification } from '@/types/api/certification'

export const updateCertificationStatusAction = async (
  certificationId: string,
  state: {
    certification: AdminCertification | null
    message: string
  },
  formData: FormData
) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  const approve = formData.get('approve') === 'true'
  const rejectionReason = formData.get('rejectionReason') as CertificationRejectionReason

  const payload = approve ? { approve } : { approve, rejectionReason }

  try {
    const certification = await updateCertificationStatus(
      certificationId,
      session.accessToken,
      payload
    )
    return { ...state, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'CERTIFICATION_NOT_FOUND':
        return { ...state, message: '인증요청이 존재하지 않습니다.', certification: null }
      // 아래 에러들은 클라이언트에서 모두 사전 방지하고 있으므로
      // 발생하면 비정상적인 접근으로 간주하여 에러 페이지로 보냄
      // case 'ONLY_ADMIN_CAN':
      //   return { ...state, message: '관리자만 할 수 있는 기능입니다.' }
      // case 'APPROVAL_SHOULD_NOT_HAVE_REASON':
      //   return { ...state, message: '승인일 경우, 거절 사유를 입력하면 안 됩니다.' }
      // case 'REJECTION_REASON_REQUIRED':
      //   return { ...state, message: '거절일 경우, 거절 사유는 필수입니다.' }
      case 'UNEXPECTED_ERROR':
        throw new Error('UNEXPECTED_ERROR')
      // 코드 오류나 프레임워크 내부 예외 등 완전히 예상치 못한 예외 (ex. NEXT_REDIRECT, CallbackRouteError, ReferenceError 등)
      default:
        console.error(error)
        // TODO: error.tsx 제대로 구현 후 error도 넘겨주게 변경
        throw new Error('UNHANDLED_ERROR')
    }
  }
}
