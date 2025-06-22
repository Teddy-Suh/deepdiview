import ReviewCarousel from '@/components/ui/ReviewCarousel'
import { getReviews } from '@/lib/api/review'
import { ChevronRight } from 'lucide-react'
import { Session } from 'next-auth'
import Link from 'next/link'

export default async function LatestReviewSection({
  session,
  movieId,
}: {
  session: Session | null
  movieId: string
}) {
  const { content: reviews } = await getReviews(movieId, !!session, session?.accessToken, {
    certifiedFilter: true,
    size: 9,
    page: 0,
  })

  return (
    <section className='container-wrapper'>
      <div className='flex justify-between'>
        <h3 className='mb-3 text-xl font-semibold'>최신 리뷰</h3>
        {reviews.length !== 0 && (
          <Link className='flex' href='/board/reviews'>
            더보기
            <ChevronRight />
          </Link>
        )}
      </div>
      {reviews.length === 0 ? (
        <div className='bg-base-300 rounded-2xl px-4 py-6 text-center md:text-start'>
          <p>아직 리뷰가 없습니다.</p>
        </div>
      ) : (
        <ReviewCarousel reviews={reviews} withMovie={false} />
      )}
    </section>
  )
}
