import Link from 'next/link'
import CreateVoteFom from './CreateVoteFom'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user?.role !== 'ADMIN') redirect('/')

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
