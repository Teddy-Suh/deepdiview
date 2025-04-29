import Link from 'next/link'
import LoginForm from './LoginForm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/')

  return (
    <div>
      <h2>로그인 페이지</h2>
      <div>
        <LoginForm />
        <Link href='/register' className='btn btn-secondary'>
          회원가입
        </Link>
      </div>
    </div>
  )
}
