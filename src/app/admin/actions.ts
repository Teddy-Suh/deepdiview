'use server'

import { auth } from '@/auth'
import { createVote } from '@/lib/api/vote'

export const createVoteAction = async (state: { message: string } = { message: '' }) => {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  try {
    await createVote(session.accessToken)
    return { ...state, message: '투표 생성 성공' }
  } catch (error) {
    const errorCode = (error as Error).message
    switch (errorCode) {
      case 'ONLY_ADMIN_CAN':
        return { ...state, message: '관리자만 할 수 있는 기능입니다.' }
      case 'INVALID_VOTE_CREATE_DATE':
        return { ...state, message: '투표 생성은 일요일에만 가능합니다.' }
      case '"ALREADY_EXIST_VOTE",':
        return { ...state, message: '이미 이번주에 생성한 투표가 있습니다.' }
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
