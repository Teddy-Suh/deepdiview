import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getIsSunday } from '@/lib/api/discussion'
import CreateVoteSection from './CreateVoteSection'

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/login')

  if (session.user?.role !== 'ADMIN') redirect('/')
  const { isSunday } = await getIsSunday()

  return (
    <div className='container-wrapper space-y-6 md:mt-2'>
      <section>
        <h3 className='mb-3 text-xl font-semibold'>시청 인증 관리</h3>
        <div className='bg-base-300 flex flex-col items-center gap-4 rounded-2xl p-4 md:flex-row md:justify-between md:gap-0'>
          {isSunday ? (
            <p className='my-2 break-keep'>일요일에는 시청 인증이 없습니다.</p>
          ) : (
            <>
              <p className='break-keep'>회원님들의 시청 인증을 관리해 주세요.</p>
              <Link className='btn btn-primary' href='/admin/watch-approval'>
                시청 인증 관리
              </Link>
            </>
          )}
        </div>
      </section>
      <CreateVoteSection session={session} isSunday={isSunday} />
    </div>
  )
}
