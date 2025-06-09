import AuthFormWrapper from '@/components/ui/AuthFormWrapper'
import NicknameForm from './NicknameForm'

export default function RegisterNicknamePage() {
  return (
    <AuthFormWrapper title='회원가입' description='닉네임을 입력해 주세요.' currentStep={4}>
      <NicknameForm />
    </AuthFormWrapper>
  )
}
