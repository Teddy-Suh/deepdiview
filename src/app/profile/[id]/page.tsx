export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getMyProfile, getUserProfile } from '@/lib/api/user'
import { redirect } from 'next/navigation'
import { getIsSunday } from '@/lib/api/discussion'
import SettingsSection from './SettingsSection'
import ProfileWrapper from './ProfileWrapper'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !session.user) redirect('/login')

  const [{ id }, { isSunday }] = await Promise.all([params, getIsSunday()])
  const { userId, role } = session.user
  const isCurrentUser = userId === Number(id)

  let profile
  if (isCurrentUser) {
    profile = await getMyProfile(session?.accessToken)
  } else {
    profile = await getUserProfile(session?.accessToken, id)
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
