'use server'

import { auth } from '@/auth'
import {
  createCertification,
  deleteCertification,
  updateCertification,
} from '@/lib/api/certification'
import { UserCertification } from '@/types/api/certification'

export const createCertificationAction = async (
  croppedImage: Blob | null,
  state: { message: string; certification: UserCertification | null }
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  if (croppedImage === null) throw new Error('NO_PHOTO')
  const formData = new FormData()

  // name 없는 Blob → File로 감싸기
  const file = new File([croppedImage], 'profile.jpg', { type: croppedImage.type })
  formData.append('file', file)

  try {
    const certification = await createCertification(session.accessToken, formData)
    return { ...state, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'ALREADY_APPROVED':
        return { ...state, message: '이미 승인되었습니다.' }
      case 'IMAGE_FILE_ONLY':
        return { ...state, message: '이미지 파일만 업로드 가능합니다.' }
      case 'FILE_SIZE_EXCEEDED':
        return { ...state, message: '파일 크기는 5MB를 초과할 수 없습니다' }
      case 'FILE_NOT_FOUND':
        return { ...state, message: '파일을 업로드 해주세요.' }
      case 'FILE_UPLOAD_FAILED':
        return { ...state, message: '파일 업로드 중 문제가 발생했습니다' }
      case 'CERTIFICATION_NOT_ALLOWED_ON_SUNDAY':
        return { ...state, message: "인증 가능 기간은 '월-토'입니다." }
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

export const updateCertificationAction = async (
  croppedImage: Blob | null,
  state: { message: string; certification: UserCertification | null }
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  if (croppedImage === null) throw new Error('NO_PHOTO')
  const formData = new FormData()

  // name 없는 Blob → File로 감싸기
  const file = new File([croppedImage], 'profile.jpg', { type: croppedImage.type })
  formData.append('file', file)

  try {
    const certification = await updateCertification(session.accessToken, formData)
    return { ...state, certification }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'CERTIFICATION_NOT_FOUND':
        return { ...state, message: '인증요청이 존재하지 않습니다.' }
      case 'ALREADY_APPROVED':
        return { ...state, message: '이미 승인되었습니다.' }
      case 'IMAGE_FILE_ONLY':
        return { ...state, message: '이미지 파일만 업로드 가능합니다.' }
      case 'FILE_SIZE_EXCEEDED':
        return { ...state, message: '파일 크기는 5MB를 초과할 수 없습니다' }
      case 'FILE_NOT_FOUND':
        return { ...state, message: '파일을 업로드 해주세요.' }
      case 'FILE_UPLOAD_FAILED':
        return { ...state, message: '파일 업로드 중 문제가 발생했습니다' }
      case 'CERTIFICATION_NOT_ALLOWED_ON_SUNDAY':
        return { ...state, message: "인증 가능 기간은 '월-토'입니다." }
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

export const deleteCertificationAction = async (state: {
  message: string
  certification: UserCertification | null
}) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  try {
    await deleteCertification(session.accessToken)
    return {
      ...state,
      certification: {
        status: 'NONE',
        certificationDetails: null,
      } as UserCertification,
    }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'CERTIFICATION_NOT_FOUND':
        return { ...state, message: '인증요청이 존재하지 않습니다.' }
      case 'ALREADY_APPROVED':
        return { ...state, message: '이미 승인되었습니다.' }
      case 'FILE_DELETE_FAILED':
        return { ...state, message: '파일 삭제 중 문제가 발생했습니다' }
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
