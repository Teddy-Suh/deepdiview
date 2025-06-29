import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ReviewCarousel from './ReviewCarousel'
import { getLatestReviews } from '@/lib/api/review'
import { Session } from 'next-auth'

export default async function LatestReviewSection({
  session,
  href,
  withMovie = true,
}: {
  session: Session | null
  href: string
  withMovie?: boolean
}) {
  const { content: reviews } = await getLatestReviews(!!session, session?.accessToken)

  return (
    <section className='container-wrapper'>
      <div className='flex justify-between'>
        <h3 className='mb-3 text-xl font-semibold'>최신 리뷰</h3>
        <Link className='flex' href={href}>
          더보기
          <ChevronRight />
        </Link>
      </div>
      <ReviewCarousel reviews={reviews} withMovie={withMovie} />
    </section>
  )
}
