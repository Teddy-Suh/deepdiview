export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getMyProfile, getUserProfile } from '@/lib/api/user'
import { notFound, redirect } from 'next/navigation'
import { getIsSunday } from '@/lib/api/discussion'
import SettingsSection from './SettingsSection'
import ProfileWrapper from './ProfileWrapper'
import { USER_CODES } from '@/constants/messages/users'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  if (!session || !session.user) redirect(`/login?from=/profile/${id}`)

  const { userId } = session.user
  const isCurrentUser = userId === Number(id)

  let nickname
  if (isCurrentUser) {
    nickname = session.user.nickname
    return {
      title: `${nickname}`,
    }
  }

  try {
    const profile = await getUserProfile(session?.accessToken, id)
    nickname = profile.nickname
    return {
      title: `${nickname}`,
    }
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === USER_CODES.USER_NOT_FOUND) return notFound()
    throw error
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const [{ id }, { isSunday }] = await Promise.all([params, getIsSunday()])

  if (!session || !session.user) redirect(`/login?from=/profile/${id}`)

  const { userId, role } = session.user
  const isCurrentUser = userId === Number(id)

  let profile
  try {
    if (isCurrentUser) {
      profile = await getMyProfile(session.accessToken)
    } else {
      profile = await getUserProfile(session.accessToken, id)
    }
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === USER_CODES.USER_NOT_FOUND) return notFound()
    throw error
  }

  return (
    <>
      {/* 전체 래퍼 flex-1 으로 최대 높이 가지면서 요소들 화면 가운데 위치 */}
      <div className='container-wrapper flex flex-col md:flex-1 md:items-center md:justify-center'>
        {/* 프로필 섹션, 별점 분석 센션 */}
        <ProfileWrapper
          profile={profile}
          isCurrentUser={isCurrentUser}
          id={id}
          isSunday={isSunday}
        />
        {/* 설정 페이지 이동 버튼 */}
        {isCurrentUser && <SettingsSection isAdmin={role === 'ADMIN'} />}
      </div>
    </>
  )
}
