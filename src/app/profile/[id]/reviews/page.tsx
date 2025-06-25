export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewList from '@/components/ui/ReviewList'
import SortButton from '@/components/ui/SortButton'
import { getUserReviews } from '@/lib/api/user'
import { ReviewSortField } from '@/types/api/common'
import { redirect } from 'next/navigation'

export default async function UserReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: ReviewSortField }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const [{ id }, { sort = 'createdAt' }] = await Promise.all([params, searchParams])
  const reviews = await getUserReviews(session.accessToken, id, {
    page: 0,
    size: 12,
    sort: `${sort},desc`,
  })

  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>리뷰</h2>
        <div className='flex space-x-3'>
          <SortButton
            pathPrefix={`/profile/${id}/reviews`}
            targetValue='createdAt'
            currentValue={sort}
            label='최신'
          />
          <SortButton
            pathPrefix={`/profile/${id}/reviews`}
            targetValue='likeCount'
            currentValue={sort}
            label='인기'
          />
          <SortButton
            pathPrefix={`/profile/${id}/reviews`}
            targetValue='rating'
            currentValue={sort}
            label='별점'
          />
        </div>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>리뷰</h2>
          <div className='hidden space-x-3 md:block'>
            <SortButton
              pathPrefix={`/profile/${id}/reviews`}
              targetValue='createdAt'
              currentValue={sort}
              label='최신'
            />
            <SortButton
              pathPrefix={`/profile/${id}/reviews`}
              targetValue='likeCount'
              currentValue={sort}
              label='인기'
            />
            <SortButton
              pathPrefix={`/profile/${id}/reviews`}
              targetValue='rating'
              currentValue={sort}
              label='별점'
            />
          </div>
        </div>

        <ReviewList
          session={session}
          initialReviews={reviews.content}
          initialLast={reviews.last}
          userId={id}
          sort={sort}
          isUserReviewsPage
        />
      </div>
    </>
  )
}
