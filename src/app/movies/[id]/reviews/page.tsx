export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import ReviewList from '@/components/ui/ReviewList'
import SortButton from '@/components/ui/SortButton'
import { MOVIES_CODES } from '@/constants/messages/movie'
import { getReviews } from '@/lib/api/review'
import { ReviewSortField } from '@/types/api/common'
import { notFound } from 'next/navigation'

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

export default async function MoviesReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sort?: ReviewSortField; title: string }>
}) {
  const [{ id }, { sort = 'createdAt', title }, session] = await Promise.all([
    params,
    searchParams,
    auth(),
  ])

  let reviews
  try {
    reviews = await getReviews(id, !!session, session?.accessToken, {
      page: 0,
      size: 12,
      sort: `${sort},desc`,
    })
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === MOVIES_CODES.MOVIE_NOT_FOUND) return notFound()
    throw error
  }

  return (
    <>
      <GoBackHeader>
        <h2 className='line-clamp-1 flex-1 text-xl font-semibold'>{title}</h2>
        <div className='flex space-x-3'>
          <SortButton
            pathPrefix={`/movies/${id}/reviews?title=${title}`}
            targetValue='createdAt'
            currentValue={sort}
            label='최신'
          />
          <SortButton
            pathPrefix={`/movies/${id}/reviews?title=${title}`}
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
              pathPrefix={`/movies/${id}/reviews?title=${title}`}
              targetValue='createdAt'
              currentValue={sort}
              label='최신'
            />
            <SortButton
              pathPrefix={`/movies/${id}/reviews?title=${title}`}
              targetValue='likeCount'
              currentValue={sort}
              label='인기'
            />
          </div>
        </div>

        <ReviewList
          session={session}
          initialReviews={reviews.content}
          initialLast={reviews.last}
          withMovie={false}
          movieId={id}
          sort={sort}
        />
      </div>
    </>
  )
}
