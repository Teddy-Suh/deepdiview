import { getCertification } from '@/lib/api/certification'
import { Session } from 'next-auth'
import Link from 'next/link'

export default async function MyReviewWrapper({
  session,
  movieId,
}: {
  session: Session
  movieId: string
}) {
  const { status: certificationStatus } = await getCertification(session?.accessToken)
  return (
    <div className='bg-base-300 flex flex-col items-center gap-4 rounded-2xl p-4 md:flex-row md:justify-between md:gap-0'>
      <p className='text-center break-keep'>
        이 주의 영화에 대한 <span className='font-bold'>{session.user?.nickname}</span> 님의 생각이
        궁금해요!
      </p>
      {certificationStatus === 'APPROVED' ? (
        // 인증된 경우 - 리뷰 작성 안내
        <>
          <Link className='btn btn-primary' href='/board/create'>
            인증된 리뷰 작성하기
          </Link>
        </>
      ) : (
        // 인증 안 된 경우 - 인증 안내 및 일반 리뷰 작성 안내
        <>
          <div className='space-x-2 md:space-x-4'>
            <Link className='btn btn-primary btn-sm md:btn-md' href='/profile/watch-verification'>
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
    </div>
  )
}
