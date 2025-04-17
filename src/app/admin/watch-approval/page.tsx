import { auth } from '@/auth'
import { getCertifications } from '@/lib/api/certification'
import CertificationItem from './CertificationItem'

export default async function AdminWatchApprovalPage() {
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')
  const certifications = await getCertifications(session.accessToken)

  // TODO: 페이지네이션 무한스크롤, 필터링
  return (
    <>
      <h2>관리자 인증 관리 페이지</h2>
      {certifications.content.map((certification) => (
        <CertificationItem key={certification.id} certification={certification} />
      ))}
    </>
  )
}
