'use server'

import { auth } from '@/auth'
import { CERTIFICATION_STATUS } from '@/constants/certification'
import { CERTIFICATION_CODES } from '@/constants/messages/certification'
import { COMMON_CODES } from '@/constants/messages/common'
import {
  createCertification,
  deleteCertification,
  updateCertification,
} from '@/lib/api/certification'
import { UserCertification } from '@/types/api/certification'
import { redirect } from 'next/navigation'

export const createCertificationAction = async (
  croppedImage: Blob | null,
  state: { code: string; certification: UserCertification | null }
) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  if (croppedImage === null) throw new Error(COMMON_CODES.INVALID)
  const formData = new FormData()

  // name 없는 Blob → File로 감싸기
  const file = new File([croppedImage], 'profile.jpg', { type: croppedImage.type })
  formData.append('file', file)

  try {
    const certification = await createCertification(session.accessToken, formData)
    return { ...state, code: COMMON_CODES.SUCCESS as string, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode as string }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const updateCertificationAction = async (
  croppedImage: Blob | null,
  state: { code: string; certification: UserCertification | null }
) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  if (croppedImage === null) throw new Error(COMMON_CODES.INVALID)
  const formData = new FormData()

  // name 없는 Blob → File로 감싸기
  const file = new File([croppedImage], 'profile.jpg', { type: croppedImage.type })
  formData.append('file', file)

  try {
    const certification = await updateCertification(session.accessToken, formData)
    return { ...state, code: COMMON_CODES.SUCCESS as string, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case CERTIFICATION_CODES.ALREADY_APPROVED:
        return { ...state, code: errorCode as string }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const deleteCertificationAction = async (state: {
  code: string
  certification: UserCertification | null
}) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  try {
    await deleteCertification(session.accessToken)
    return {
      ...state,
      code: COMMON_CODES.SUCCESS as string,
      certification: {
        status: CERTIFICATION_STATUS.NONE,
        certificationDetails: null,
      } as UserCertification,
    }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case CERTIFICATION_CODES.ALREADY_APPROVED:
        return { ...state, code: errorCode as string }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}
