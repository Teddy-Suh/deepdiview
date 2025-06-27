import { CertificationStatus } from '@/constants/certification'
import { getCertifications } from '@/lib/api/certification'
import { Session } from 'next-auth'
import CertificationList from './CertificationList'

export default async function CertificationListWrapper({
  session,
  status,
}: {
  session: Session
  status?: CertificationStatus
}) {
  const certifications = await getCertifications(session.accessToken, {
    status,
    page: 0,
    size: 12,
  })

  return (
    <>
      {certifications.content.length === 0 ? (
        <>시청 인증이 없습니다.</>
      ) : (
        <CertificationList
          session={session}
          initialCertifications={certifications.content}
          initialLast={!certifications.hasNext}
          initialNextCreatedAt={certifications.nextCreatedAt}
          initialNextId={certifications.nextId}
          status={status}
        />
      )}
    </>
  )
}
