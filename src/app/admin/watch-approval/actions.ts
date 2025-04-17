'use server'

import { auth } from '@/auth'
import { updateCertificationStatus } from '@/lib/api/certification'
import { Certification } from '@/types/api/certification'
import { CertificationRejectionReason } from '@/types/api/common'

export const updateCertificationStatusAction = async (
  state: {
    certification: Certification
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
      state.certification.id.toString(),
      session.accessToken,
      payload
    )
    return { ...state, certification, message: '처리 성공' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'CERTIFICATION_NOT_FOUND':
        return { ...state, message: '인증요청이 존재하지 않습니다.' }
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
