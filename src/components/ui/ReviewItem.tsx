import { getRelativeTime } from '@/utils/date'
import { Review } from '@/types/api/common'
import Image from 'next/image'
import Rating from './Rating'
import { MessageCircle } from 'lucide-react'
import clsx from 'clsx'
import CertifiedBadge from './CertifiedBadge'
import LikeButton from './LikeButton'
import Link from 'next/link'
import ReviewWithCommentWrapper from '@/app/profile/[id]/comments/ReviewWithCommentWrapper'
import { ReviewWithComment } from '@/types/api/user'

export default function ReviewItem({
  from,
  review,
  withMovie = true,
  withComment = false,
  isDetail = false,
  isUserReviewsPage = false,
}: {
  from?: string
  review: Review | ReviewWithComment
  withMovie?: boolean
  withComment?: boolean
  isDetail?: boolean
  isUserReviewsPage?: boolean
}) {
  const profile = (
    <div className='flex items-center gap-2'>
      {isUserReviewsPage ? (
        <>
          <p className='text-gray-500'>{getRelativeTime(review.createdAt)}</p>
          {review.certified && <CertifiedBadge />}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
  const content = (
    <div
      className={clsx(
        'bg-base-300 rounded-3xl p-4',
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
                  className='rounded-lg'
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
      {/* 하단 영화 제목 & 좋아요, 댓글 */}
      {!withComment && (
        <>
          <hr className='text-gray-300 dark:text-gray-700' />
          <div className={clsx('flex', withMovie && 'justify-between gap-3')}>
            <div
              className={clsx('flex flex-2 gap-3', withMovie ? 'justify-start' : 'justify-start')}
            >
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
        </>
      )}
    </div>
  )

  // 특정 사용자가 작성한 댓글 페이지
  if (withComment && 'comment' in review)
    return <ReviewWithCommentWrapper comment={review.comment}>{content}</ReviewWithCommentWrapper>

  // 리뷰 상세 페이지
  if (isDetail) return <>{content}</>

  return (
    <Link href={`/reviews/${review.reviewId}?from=${encodeURIComponent(from || '')}`}>
      {content}
    </Link>
  )
}
