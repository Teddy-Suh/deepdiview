import Link from 'next/link'
import LoginForm from './LoginForm'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import AuthFormWrapper from '@/components/ui/AuthFormWrapper'

export default function LoginPage() {
  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>로그인</h2>
        <Link href='/register/1-send-email' className='btn btn-secondary rounded-xl'>
          회원가입
        </Link>
      </GoBackHeader>
      <AuthFormWrapper title={'로그인'}>
        <LoginForm />
      </AuthFormWrapper>
    </>
  )
}
