import { getRelativeTime } from '@/lib/utils/date'
import { Review } from '@/types/api/common'
import Image from 'next/image'
import Rating from './Rating'
import { MessageCircle } from 'lucide-react'
import clsx from 'clsx'
import CertifiedBadge from './CertifiedBadge'
import LikeButton from './LikeButton'
import Link from 'next/link'

export default function ReviewItem({
  review,
  withMovie = true,
  isDetail = false,
}: {
  review: Review
  withMovie?: boolean
  isDetail?: boolean
}) {
  const profile = (
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
  )
  const content = (
    <div
      className={clsx(
        'bg-base-300 rounded-xl p-4',
        withMovie ? 'space-y-3' : 'flex flex-col gap-3',
        withMovie === false && isDetail === false && 'h-64'
      )}
    >
      {/* 상단 유저 정보 & 별점*/}
      <div className='flex items-center justify-between'>
        {isDetail ? <Link href={`/profile/${review.userId}`}>{profile}</Link> : <>{profile}</>}
        <Rating rating={review.rating} readOnly={true} />
      </div>
      {/* 중간 영화 포스터 & 리뷰 */}
      <div className={clsx(withMovie ? 'flex gap-3' : 'flex-1 space-y-1 overflow-hidden')}>
        {withMovie && (
          <div className='flex flex-1 flex-col gap-1.5'>
            <div className='relative aspect-[2/3] shrink-0'>
              <Image
                src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                alt={`${review.movieTitle} 포스터`}
                fill
                className='rounded-lg object-cover'
              />
            </div>
            <p className='line-clamp-1 text-center'>{review.movieTitle}</p>
          </div>
        )}
        <div className={clsx('space-y-2', withMovie && 'flex-2 overflow-hidden')}>
          {isDetail && (
            <Link href={`/movies/${review.tmdbId}`}>
              <div className='flex flex-col items-center gap-3 py-2 md:float-left md:mr-6 md:py-0'>
                <Image
                  className='rounded-2xl'
                  src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                  alt={`${review.movieTitle} 포스터`}
                  width={200}
                  height={300}
                />
                <p>{review.movieTitle}</p>
              </div>
            </Link>
          )}
          <p
            className={clsx(
              'text-lg font-bold break-words',
              isDetail ? 'whitespace-pre-wrap' : 'line-clamp-1'
            )}
          >
            {review.reviewTitle}
          </p>
          <p className={clsx('break-words', isDetail ? 'whitespace-pre-wrap' : 'line-clamp-4')}>
            {review.reviewContent}
          </p>
        </div>
      </div>
      <hr className='text-gray-600' />
      {/* 하단 영화 제목 & 좋아요, 댓글 */}
      <div className={clsx('flex', withMovie && 'justify-between gap-3')}>
        <div className={clsx('flex flex-2 gap-3', withMovie ? 'justify-start' : 'justify-start')}>
          <LikeButton
            likedByUser={review.likedByUser}
            likeCount={review.likeCount}
            reviewId={review.reviewId.toString()}
            readOnly={!isDetail}
          />
          <div className='flex gap-1'>
            <MessageCircle />
            <p>{review.commentCount}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>{isDetail ? <>{content}</> : <Link href={`/reviews/${review.reviewId}`}>{content}</Link>}</>
  )
}
