import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ReviewCarousel from '@/components/ui/ReviewCarousel'
import { Review } from '@/types/api/common'

export default function LatestReviewSection({
  latestReviews,
  href,
  withMovie = true,
}: {
  latestReviews: Review[]
  href: string
  withMovie?: boolean
}) {
  return (
    <section className='container-wrapper'>
      <div className='flex justify-between'>
        <h3 className='mb-3 text-xl font-semibold'>최신 리뷰</h3>
        <Link className='flex' href={href}>
          더보기
          <ChevronRight />
        </Link>
      </div>
      <ReviewCarousel reviews={latestReviews} withMovie={withMovie} />
    </section>
  )
}
