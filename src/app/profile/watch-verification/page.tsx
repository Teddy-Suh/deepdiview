import { auth } from '@/auth'
import { getCertification } from '@/lib/api/certification'
import ImgForm from './ImgForm'
import { redirect } from 'next/navigation'

export default async function WatchVerificationPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const certification = await getCertification(session.accessToken)
  console.log(certification)
  return (
    <>
      <h2>유저 시청 인증 페이지</h2>
      <div>
        <p>날짜: {certification.createdAt}</p>
        <p>상태: {certification.status}</p>
        {certification.rejectionReason && <p>이유: {certification.rejectionReason}</p>}
      </div>
      <div>
        <ImgForm status={certification.status} certificationUrl={certification.certificationUrl} />
      </div>
    </>
  )
}
