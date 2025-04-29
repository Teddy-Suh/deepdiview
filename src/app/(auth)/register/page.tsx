import { auth } from '@/auth'
import RegisterForm from './RegisterForm'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <>
      <h2>회원가입 페이지</h2>
      <RegisterForm />
    </>
  )
}
