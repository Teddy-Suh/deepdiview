import { getRelativeTime } from '@/lib/utils/date'
import { Review } from '@/types/api/common'
import Image from 'next/image'
import Link from 'next/link'
import Rating from './Rating'
import { Heart, MessageCircle } from 'lucide-react'
import clsx from 'clsx'
import CertifiedBadge from './CertifiedBadge'

export default function ReviewItem({
  review,
  withMovie = true,
}: {
  review: Review
  withMovie?: boolean
}) {
  return (
    <Link href={`/reviews/${review.reviewId}`}>
      <div
        className={clsx(
          'bg-base-300 rounded-xl p-4',
          withMovie ? 'space-y-2' : 'flex h-56 flex-col gap-3'
        )}
      >
        {/* 상단 유저 정보 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Image
              src={`${review.profileImageUrl}`}
              alt='프로필 사진'
              width={33}
              height={33}
              className='aspect-square rounded-full'
            />
            <div>
              <div className='flex items-center gap-1'>
                <p className='text-sm'>{review.nickname}</p>
                {review.certified && <CertifiedBadge />}
              </div>
              <p className='text-xs text-gray-500'>{getRelativeTime(review.createdAt)}</p>
            </div>
          </div>
          <Rating rating={review.rating} readOnly={true} />
        </div>
        {/* 중간 영화 포스터 & 리뷰 */}
        <div className={clsx(withMovie ? 'flex gap-3' : 'flex-1 space-y-1 overflow-hidden')}>
          {withMovie && (
            <div className='relative aspect-[2/3] flex-1 shrink-0'>
              <Image
                src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                alt={`${review.movieTitle} 포스터`}
                fill
                className='rounded-lg object-cover'
              />
            </div>
          )}
          <div className={clsx(withMovie ? 'flex-2 space-y-1 overflow-hidden' : 'space-y-1')}>
            <p className='line-clamp-1 text-lg font-bold'>{review.reviewTitle}</p>
            <p className='line-clamp-3 break-words'>{review.reviewContent}</p>
          </div>
        </div>
        {/* 하단 영화 제목 & 좋아요, 댓글 */}
        <div className='flex justify-between gap-3'>
          {withMovie && (
            <p className='truncate overflow-hidden whitespace-nowrap'>{review.movieTitle}</p>
          )}
          <div className='flex'>
            <Heart />
            <p className='mr-3'>{review.likeCount}</p>
            <MessageCircle />
            <p>{review.commentCount}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
