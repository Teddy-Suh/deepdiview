import AuthFormWrapper from '@/components/ui/AuthFormWrapper'
import SendEmailForm from './SendEmailForm'

export default function RegisterSendEmailPage() {
  return (
    <AuthFormWrapper title='회원가입' description='이메일을 입력해 주세요.' currentStep={1}>
      <SendEmailForm />
    </AuthFormWrapper>
  )
}
