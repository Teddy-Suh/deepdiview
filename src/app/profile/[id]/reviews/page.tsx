export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import SortButton from '@/components/ui/SortButton'
import { ReviewSortField } from '@/types/api/common'
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
    title: `${nickname} - 리뷰`,
  }
}

export default async function UserReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: ReviewSortField; nickname: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ id }, { sort = 'createdAt', nickname }] = await Promise.all([params, searchParams])

  return (
    <>
      <GoBackHeader>
        <h2 className='line-clamp-1 flex-1 text-xl font-semibold'>{nickname}의 리뷰</h2>
        <div className='flex space-x-3'>
          <SortButton
            pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
            targetValue='createdAt'
            currentValue={sort}
            label='최신'
          />
          <SortButton
            pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
            targetValue='likeCount'
            currentValue={sort}
            label='인기'
          />
          <SortButton
            pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
            targetValue='rating'
            currentValue={sort}
            label='별점'
          />
        </div>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>
            {nickname}의 리뷰
          </h2>
          <div className='hidden space-x-3 md:block'>
            <SortButton
              pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
              targetValue='createdAt'
              currentValue={sort}
              label='최신'
            />
            <SortButton
              pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
              targetValue='likeCount'
              currentValue={sort}
              label='인기'
            />
            <SortButton
              pathPrefix={`/profile/${id}/reviews?nickname=${nickname}`}
              targetValue='rating'
              currentValue={sort}
              label='별점'
            />
          </div>
        </div>
        <Suspense fallback={<ReviewListLoading withoutProfile />}>
          <ReviewListWrapper id={id} sort={sort} session={session} />
        </Suspense>
      </div>
    </>
  )
}
