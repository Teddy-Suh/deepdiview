import ReviewItem from '@/components/ui/ReviewItem'
import React, { Suspense } from 'react'
import MyReviewWrapper from './MyReviewWrapper'
import Link from 'next/link'
import { Session } from 'next-auth'
import { Review } from '@/types/api/common'

export default function MyReviewSection({
  isSunday,
  session,
  movieId,
  movieTitle,
  myReview,
}: {
  isSunday: boolean
  session: Session | null
  movieId: string
  movieTitle: string
  myReview: Review | null
}) {
  return (
    <>
      {!isSunday && (
        <section className='container-wrapper'>
          <h3 className='mb-3 text-xl font-semibold'>내가 쓴 리뷰</h3>
          {session ? (
            <>
              {myReview ? (
                <ReviewItem review={myReview} withMovie={false} />
              ) : (
                <Suspense fallback={<div className='skeleton h-18 rounded-3xl' />}>
                  <MyReviewWrapper session={session} movieId={movieId} movieTitle={movieTitle} />
                </Suspense>
              )}
            </>
          ) : (
            <div className='bg-base-300 flex flex-col items-center gap-4 rounded-3xl p-4 md:flex-row md:justify-between md:gap-0'>
              <p className='text-center break-keep'>
                <span className='font-bold'>DeepDiview</span> 회원이 되셔서 이 영화에 대한 생각을
                공유해주세요!
              </p>
              <Link className='btn btn-primary' href='/login'>
                로그인하고 리뷰 작성하기
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  )
}
