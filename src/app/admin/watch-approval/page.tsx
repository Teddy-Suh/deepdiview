import { auth } from '@/auth'
import { getCertifications } from '@/lib/api/certification'
import CertificationItem from './CertificationItem'
import { redirect } from 'next/navigation'

export default async function AdminWatchApprovalPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user?.role !== 'ADMIN') redirect('/')

  const now = new Date()
  const createdAt = now.toISOString()

  const certifications = await getCertifications(session.accessToken, {
    createdAt,
    status: 'PENDING',
    page: 1,
  })

  console.log(certifications)

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
