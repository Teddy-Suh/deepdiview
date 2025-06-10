'use server'

import { auth, signOut, update } from '@/auth'
import {
  deleteProfileImg,
  logout,
  updateIntro,
  updateNickname,
  updateProfileImg,
} from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const updateProfileImgAction = async (
  croppedImage: Blob | null,
  state: { success: boolean | null; message: string }
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  if (croppedImage === null) throw new Error('NO_PHOTO')
  const formData = new FormData()

  // name 없는 Blob → File로 감싸기
  const file = new File([croppedImage], 'profile.jpg', { type: croppedImage.type })
  formData.append('file', file)

  try {
    const { profileImageUrl } = await updateProfileImg(session.accessToken, formData)
    await update({
      user: {
        profileImageUrl,
      },
    })
    return { ...state, success: true }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'IMAGE_FILE_ONLY':
        return { ...state, message: '이미지 파일만 업로드 가능합니다.' }
      case 'FILE_SIZE_EXCEEDED':
        return { ...state, message: '파일 크기는 5MB를 초과할 수 없습니다' }
      case 'FILE_NOT_FOUND':
        return { ...state, message: '파일을 업로드 해주세요.' }
      case 'FILE_UPLOAD_FAILED':
        return { ...state, message: '파일 업로드 중 문제가 발생했습니다' }
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

export const deleteProfileImgAction = async (state: { message: string }) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  try {
    const { profileImageUrl } = await deleteProfileImg(session.accessToken)
    await update({
      user: {
        profileImageUrl,
      },
    })
    return { ...state }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
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

export const updateNicknameAction = async (
  state: { message: string; nickname: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const newNickname = formData.get('newNickname') as string

  try {
    const { updatedNickname } = await updateNickname(session.accessToken, {
      newNickname,
    })
    // 서버 사이드에서 세션 업데이트
    await update({
      user: {
        nickname: updatedNickname,
      },
    })
    return { ...state, message: 'success', nickname: updatedNickname }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'ALREADY_EXIST_NICKNAME':
        return { ...state, message: '중복 닉네임 입니다' }
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

export const updateIntroAction = async (
  state: { message: string; intro: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const oneLineIntro = formData.get('oneLineIntro') as string

  try {
    const updatedOneLineIntro = (
      await updateIntro(session.accessToken, {
        oneLineIntro,
      })
    ).updatedOneLineIntro
    return { ...state, message: 'success', intro: updatedOneLineIntro ?? '' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
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

export const signOutAction = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('UNAUTHORIZED')
    await logout(session.accessToken)
  } catch (error) {
    console.error(error)
    throw new Error('UNHANDLED_ERROR')
  } finally {
    // access token이 만료되면 try 블록 내의 signOut이 실행되지 않음
    // 로그아웃 버튼 클릭 시 클라이언트 세션은 항상 삭제되도록 처리함
    // TODO: access token 만료(401) 시 처리 로직 추가 필요
    await signOut({ redirect: false })
    redirect('/')
  }
}
