import { auth } from '@/auth'
import NicknameForm from './NicknameForm'

export default async function SettingsNicknamePage() {
  const session = await auth()
  if (!session?.user) throw new Error('UNAUTHORIZED')
  const nickname = session?.user?.nickname

  return (
    <>
      <h2>닉네임 설정 페이지</h2>
      <NicknameForm nickname={nickname} />
    </>
  )
}
