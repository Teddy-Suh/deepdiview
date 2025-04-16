import Link from 'next/link'
import CreateVoteFom from './CreateVoteFom'

export default function AdminPage() {
  return (
    <>
      <h2>관리자 페이지</h2>
      <CreateVoteFom />
      <Link className='btn' href={'/admin/watch-approval'}>
        시청 인증 관리
      </Link>
    </>
  )
}
