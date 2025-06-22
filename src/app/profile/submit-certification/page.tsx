import { auth } from '@/auth'
import { getCertification } from '@/lib/api/certification'
import SubmitCertificationForm from './SubmitCertificationForm'
import { redirect } from 'next/navigation'
import { CERTIFICATION_STATUS } from '@/constants/certification'
import { getIsSunday } from '@/lib/api/discussion'

export default async function SubmitCertificationPage() {
  const session = await auth()
  if (!session) redirect('/login')

  // TODO: 토스트 메세지 또는 에러 던져서 에러 페이지에서 안내
  const { isSunday } = await getIsSunday()
  if (isSunday) redirect(`/profile/${session.user?.id}`)

  const certification = await getCertification(session.accessToken)

  // 이미 승인되었으면 게시판으로
  if (certification.status === CERTIFICATION_STATUS.APPROVED) redirect('/board')

  // 버튼이 제출 버튼이 헤더에 있기때문에 Form안에 넣음
  return <SubmitCertificationForm session={session} initialCertification={certification} />
}
