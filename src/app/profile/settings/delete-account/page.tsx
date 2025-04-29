import { auth } from '@/auth'
import DeleteAccountForm from './DeleteAccountForm'
import { redirect } from 'next/navigation'

export default async function SettingsDeleteAccountPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <>
      <h2>회원탈퇴 페이지</h2>
      <DeleteAccountForm />
    </>
  )
}
