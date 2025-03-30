import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
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
