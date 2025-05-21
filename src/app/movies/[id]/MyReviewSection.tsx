import ReviewItem from '@/components/ui/ReviewItem'
import { CertificationStatus, Review } from '@/types/api/common'
import { Session } from 'next-auth'
import Link from 'next/link'

export default function MyReviewSection({
  session,
  myReview,
  isThisWeekMovie,
  isSunday,
  certificationStatus,
  movieId,
}: {
  session: Session | null
  myReview: Review | null
  isThisWeekMovie: boolean
  isSunday: boolean
  certificationStatus: CertificationStatus
  movieId: string
}) {
  return (
    <section className='container-wrapper'>
      <h3 className='mb-3 text-xl font-semibold'>내가 쓴 리뷰</h3>
      {session ? (
        // 로그인 한 경우
        <>
          {myReview ? (
            // 작성한 리뷰가 있는 경우
            // ReviewItem으로 작성한 리뷰 출력
            <ReviewItem review={myReview} withMovie={false} />
          ) : (
            // 작성한 리뷰가 없는 경우
            // MyReviewBox으로 안내
            <div className='bg-base-300 flex flex-col items-center gap-4 rounded-2xl p-4 md:flex-row md:justify-between md:gap-0'>
              {isThisWeekMovie && !isSunday ? (
                // 인증된 리뷰가 작성 가능한 경우 (이주의 영화이면서 일요일이 아닌 경우)
                <>
                  {certificationStatus === 'APPROVED' ? (
                    // 인증된 경우
                    // 리뷰 작성 안내
                    <>
                      <p>
                        이 영화에 대한 <span className='font-bold'>{session.user?.nickname}</span>{' '}
                        님의 생각이 궁금해요!
                      </p>
                      <Link className='btn btn-primary' href={`/board/create`}>
                        인증된 리뷰 작성하기
                      </Link>
                    </>
                  ) : (
                    // 인증 안 된 경우
                    // 인증 안내 및 일반 리뷰 작성 안내
                    <>
                      <p className='text-center break-keep'>
                        이주의 영화에 대한{' '}
                        <span className='font-bold'>{session.user?.nickname}</span> 님의 생각이
                        궁금해요!
                      </p>
                      <div className='space-x-2 md:space-x-4'>
                        <Link
                          className='btn btn-primary btn-sm md:btn-md'
                          href={`/profile/watch-verification`}
                        >
                          인증하고 리뷰 작성하기
                        </Link>
                        <Link
                          className='btn btn-primary btn-sm md:btn-md'
                          href={`/movies/${movieId}/reviews/create`}
                        >
                          일반 리뷰 작성하기
                        </Link>
                      </div>
                    </>
                  )}
                </>
              ) : (
                // 인증된 리뷰가 작성 불가능한 경우 (이주의 영화가 아니거나 일요일인 경우)
                // 일반 리뷰 작성 안내
                <>
                  <p>
                    이 영화에 대한 <span className='font-bold'>{session.user?.nickname}</span> 님의
                    생각이 궁금해요!
                  </p>
                  <Link
                    className='btn btn-primary btn-sm md:btn-md'
                    href={`/movies/${movieId}/reviews/create`}
                  >
                    리뷰 작성하기
                  </Link>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        // 로그인 안한 경우
        // 로그인 안내
        <div className='bg-base-300 flex flex-col items-center gap-4 rounded-2xl p-4 md:flex-row md:justify-between md:gap-0'>
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
  )
}
