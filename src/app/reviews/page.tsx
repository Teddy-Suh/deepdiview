import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewListWrapper from './ReviewListWrapper'
import { Suspense } from 'react'
import ReviewListLoading from '@/components/ui/ReviewListLoading'

export const metadata = {
  title: '최신 리뷰',
}

export default async function ReviewsPage() {
  return (
    <>
      <GoBackHeader>
        <h2 className='text-xl font-semibold'>최신 리뷰</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <h2 className='mt-4 mb-3 hidden text-xl font-semibold md:block'>최신 리뷰</h2>
        <Suspense fallback={<ReviewListLoading withMovie />}>
          <ReviewListWrapper />
        </Suspense>
      </div>
    </>
  )
}
