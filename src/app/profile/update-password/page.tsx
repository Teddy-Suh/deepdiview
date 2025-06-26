import { auth } from '@/auth'
import UpdatePasswordForm from './UpdatePasswordForm'
import { redirect } from 'next/navigation'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import AuthFormWrapper from '@/components/ui/AuthFormWrapper'

export const metadata = {
  title: '비밀번호 변경',
}

export default async function UpdatePasswordPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>비밀번호 변경</h2>
      </GoBackHeader>
      <AuthFormWrapper title='비밀번호 변경'>
        <UpdatePasswordForm />
      </AuthFormWrapper>
    </>
  )
}
