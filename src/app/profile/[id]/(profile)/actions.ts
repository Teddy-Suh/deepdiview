'use server'

import { auth, signOut, update } from '@/auth'
import { COMMON_CODES } from '@/constants/messages/common'
import { USER_CODES } from '@/constants/messages/users'
import {
  deleteProfileImg,
  logout,
  updateIntro,
  updateNickname,
  updateProfileImg,
} from '@/lib/api/user'
import { updateIntroSchema } from '@/schemas/user/updateIntroSchema'
import { updateNicknameSchema } from '@/schemas/user/updateNicknameSchema'
import { redirect } from 'next/navigation'

export const updateProfileImgAction = async (
  croppedImage: Blob | null,
  state: { profileImageUrl: string; code: string }
) => {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (croppedImage === null) throw new Error(COMMON_CODES.INVALID)
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
    return { ...state, code: COMMON_CODES.SUCCESS, profileImageUrl }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const deleteProfileImgAction = async (state: { profileImageUrl: string; code: string }) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  try {
    const { profileImageUrl } = await deleteProfileImg(session.accessToken)
    await update({
      user: {
        profileImageUrl,
      },
    })
    return { ...state, code: COMMON_CODES.SUCCESS, profileImageUrl }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const updateNicknameAction = async (state: { code: string }, formData: FormData) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const validatedFields = updateNicknameSchema.safeParse({
    newNickname: formData.get('newNickname'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }
  const { newNickname } = validatedFields.data

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
    return { ...state, code: COMMON_CODES.SUCCESS }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
      case USER_CODES.ALREADY_EXIST_NICKNAME:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const updateIntroAction = async (
  state: { code: string; intro: string },
  formData: FormData
) => {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const validatedFields = updateIntroSchema.safeParse({
    oneLineIntro: formData.get('oneLineIntro'),
  })

  if (!validatedFields.success) {
    throw new Error(COMMON_CODES.INVALID)
  }

  const { oneLineIntro } = validatedFields.data

  try {
    const updatedOneLineIntro = (
      await updateIntro(session.accessToken, {
        oneLineIntro,
      })
    ).updatedOneLineIntro
    return { ...state, code: COMMON_CODES.SUCCESS, intro: updatedOneLineIntro ?? '' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case COMMON_CODES.NETWORK_ERROR:
        return { ...state, code: errorCode }
      default:
        console.error(error)
        throw new Error(COMMON_CODES.UNHANDLED_ERROR)
    }
  }
}

export const signOutAction = async () => {
  try {
    const session = await auth()
    if (!session) redirect('/login')
    await logout(session.accessToken)
  } catch (error) {
    console.error(error)
    throw new Error(COMMON_CODES.UNHANDLED_ERROR)
  } finally {
    // access token이 만료되면 try 블록 내의 signOut이 실행되지 않음
    // 로그아웃 버튼 클릭 시 클라이언트 세션은 항상 삭제되도록 처리함
    await signOut({ redirect: false })
    redirect('/')
  }
}
