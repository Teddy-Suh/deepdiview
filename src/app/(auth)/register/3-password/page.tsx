import AuthFormWrapper from '@/components/ui/AuthFormWrapper'
import PasswordForm from './PasswordForm'

export default function RegisterPasswordPage() {
  return (
    <AuthFormWrapper title='회원가입' description='비밀번호를 입력해 주세요.' currentStep={3}>
      <PasswordForm />
    </AuthFormWrapper>
  )
}
