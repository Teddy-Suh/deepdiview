import { auth } from '@/auth'
import PasswordForm from './PasswordForm'
import { redirect } from 'next/navigation'

export default async function SettingsPasswordPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <>
      <h2>비밀번호 설정 페이지</h2>
      <PasswordForm />
    </>
  )
}
