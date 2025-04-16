'use server'

import { auth, signOut, update } from '@/auth'
import { deleteProfileImg, logout, updateIntro, updateProfileImg } from '@/lib/api/user'
import { redirect } from 'next/navigation'

export const updateProfileImgAction = async (
  state: { message: string } = { message: '' },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  try {
    const { profileImageUrl } = await updateProfileImg(session.accessToken, formData)
    await update({
      user: {
        profileImageUrl,
      },
    })
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
  redirect(`/profile/${session.user.userId}`)
}

export const deleteProfileImgAction = async (state: { message: string } = { message: '' }) => {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')

  try {
    const { profileImageUrl } = await deleteProfileImg(session.accessToken)
    await update({
      user: {
        profileImageUrl,
      },
    })
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
  redirect(`/profile/${session.user.userId}`)
}

export const updateIntroAction = async (
  state: { message: string; intro: string } = { message: '', intro: '' },
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

export const signOutWithForm = async () => {
  try {
    const session = await auth()
    const accessToken = session?.accessToken
    if (accessToken) {
      await logout(accessToken)
    }
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
