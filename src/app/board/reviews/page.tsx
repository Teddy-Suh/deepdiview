import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import SortButton from '@/components/ui/SortButton'
import { ReviewSortField } from '@/types/api/common'
import ReviewListWrapper from './ReviewListWrapper'
import { Suspense } from 'react'
import ReviewListLoading from '@/components/ui/ReviewListLoading'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ title: string }>
}) {
  const { title } = await searchParams
  return {
    title: `${title} - 리뷰`,
  }
}

export default async function BoardReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ title: string; sort?: ReviewSortField }>
}) {
  const { title, sort = 'createdAt' } = await searchParams

  return (
    <>
      <GoBackHeader>
        <h2 className='line-clamp-1 flex-1 text-xl font-semibold'>{title}</h2>
        <div className='flex space-x-3'>
          <SortButton
            pathPrefix={`/board/reviews?title=${title}`}
            targetValue='createdAt'
            currentValue={sort}
            label='최신'
          />
          <SortButton
            pathPrefix={`/board/reviews?title=${title}`}
            targetValue='likeCount'
            currentValue={sort}
            label='인기'
          />
        </div>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='flex items-center justify-between py-1'>
          <h2 className='mt-4 mb-3 line-clamp-1 hidden text-xl font-semibold md:block'>{title}</h2>
          <div className='hidden space-x-3 md:block'>
            <SortButton
              pathPrefix={`/board/reviews?title=${title}`}
              targetValue='createdAt'
              currentValue={sort}
              label='최신'
            />
            <SortButton
              pathPrefix={`/board/reviews?title=${title}`}
              targetValue='likeCount'
              currentValue={sort}
              label='인기'
            />
          </div>
        </div>
        <Suspense fallback={<ReviewListLoading withoutMovie />}>
          <ReviewListWrapper sort={sort} />
        </Suspense>
      </div>
    </>
  )
}
