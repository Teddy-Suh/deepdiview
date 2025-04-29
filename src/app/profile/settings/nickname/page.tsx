import { auth } from '@/auth'
import NicknameForm from './NicknameForm'
import { redirect } from 'next/navigation'

export default async function SettingsNicknamePage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <>
      <h2>닉네임 설정 페이지</h2>
      <NicknameForm nickname={session.user?.nickname ?? ''} />
    </>
  )
}
