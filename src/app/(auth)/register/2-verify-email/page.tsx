import AuthFormWrapper from '@/components/ui/AuthFormWrapper'
import VerifyEmailForm from './VerifyEmailForm'

export default function RegisterVerifyEmailPage() {
  return (
    <AuthFormWrapper
      title='회원가입'
      description='이메일로 전송된 인증 코드를 입력해 주세요.'
      currentStep={2}
    >
      <VerifyEmailForm />
    </AuthFormWrapper>
  )
}
