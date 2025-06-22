'use server'

import { auth } from '@/auth'
import { CertificationRejectionReason } from '@/constants/certification'
import { CERTIFICATION_CODES } from '@/constants/messages/certification'
import { COMMON_CODES } from '@/constants/messages/common'
import { updateCertificationStatus } from '@/lib/api/certification'
import { AdminCertification } from '@/types/api/certification'
import { redirect } from 'next/navigation'

export const updateCertificationStatusAction = async (
  certificationId: string,
  state: {
    certification: AdminCertification | null
    code: string
  },
  formData: FormData
) => {
  const session = await auth()
  if (!session) redirect('/login')

  const approve = formData.get('approve') === 'true'
  const rejectionReason = formData.get('rejectionReason') as CertificationRejectionReason

  const payload = approve ? { approve } : { approve, rejectionReason }

  try {
    const certification = await updateCertificationStatus(
      certificationId,
      session.accessToken,
      payload
    )
    return { ...state, code: COMMON_CODES.SUCCESS, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      case CERTIFICATION_CODES.CERTIFICATION_NOT_FOUND:
        return { ...state, code: errorCode, certification: null }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
