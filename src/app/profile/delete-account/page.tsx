import { auth } from '@/auth'
import DeleteAccountForm from './DeleteAccountForm'
import { redirect } from 'next/navigation'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import AuthFormWrapper from '@/components/ui/AuthFormWrapper'

export default async function DeleteAccountPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user?.role === 'ADMIN') redirect(`/profile/${session.user.id}`)

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>회원 탈퇴</h2>
      </GoBackHeader>
      <AuthFormWrapper title='회원 탈퇴'>
        <DeleteAccountForm />
      </AuthFormWrapper>
    </>
  )
}
