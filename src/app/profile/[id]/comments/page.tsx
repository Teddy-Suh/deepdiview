export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { redirect } from 'next/navigation'
import ReviewListWrapper from './ReviewListWrapper'
import { Suspense } from 'react'
import ReviewListLoading from '@/components/ui/ReviewListLoading'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ nickname: string }>
}) {
  const { nickname } = await searchParams
  return {
    title: `${nickname} - 댓글`,
  }
}

export default async function UserCommentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ nickname: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ id }, { nickname }] = await Promise.all([params, searchParams])

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>{nickname}의 댓글</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>
            {nickname}의 댓글
          </h2>
        </div>
        <Suspense fallback={<ReviewListLoading withComment />}>
          <ReviewListWrapper session={session} id={id} />
        </Suspense>
      </div>
    </>
  )
}
