import { auth } from '@/auth'
import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie } from '@/lib/api/movie'
import { getReviews } from '@/lib/api/review'
import { getMyProfile } from '@/lib/api/user'
import { getVoteParticipationStatus } from '@/lib/api/vote'
import { CircleCheck, CircleUserRound, MessageCircle, ThumbsUp, Vote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function BoardPage() {
  const [{ isSunday }, { tmdbId }] = await Promise.all([getIsSunday(), getThisWeekMovieId()])

  const movieId = tmdbId.toString()

  let session, participated, certificationStatus, thisWeekMovie, reviews

  if (!isSunday) {
    session = await auth()
    if (session) {
      ;[{ participated }, { certificationStatus }, thisWeekMovie, reviews] = await Promise.all([
        getVoteParticipationStatus(session?.accessToken),
        getMyProfile(session?.accessToken),
        getMovie(movieId, !!session, session?.accessToken),
        getReviews(movieId, !!session, session?.accessToken),
      ])
    } else {
      ;[thisWeekMovie, reviews] = await Promise.all([getMovie(movieId), getReviews(movieId)])
    }
  }

  return (
    <>
      <h2>토론 게시판</h2>
      {!isSunday && (
        <div className='flex'>
          <Vote />
          {session ? (
            <>
              {participated ? (
                <Link className='btn' href='/board/vote/result'>
                  투표 결과 보기
                </Link>
              ) : (
                <Link className='btn' href='/board/vote'>
                  투표 하러 가기
                </Link>
              )}
            </>
          ) : (
            <Link href='/login'>로그인하고 투표하기</Link>
          )}
        </div>
      )}

      <section
        className='flex h-96 bg-cover bg-center'
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${thisWeekMovie?.backdrop_path})`,
        }}
      >
        <h3>{isSunday ? '다음주 영화' : '이번주 영화'}</h3>
        <div className='flex'>
          <div>
            <Link href={`/movies/${thisWeekMovie?.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${thisWeekMovie?.poster_path}`}
                alt='영화 포스터'
                width={100}
                height={150}
              />
            </Link>
          </div>
          <div>
            <p>{thisWeekMovie?.title}</p>
            <p>{thisWeekMovie?.release_date}</p>
            <p>{thisWeekMovie?.genre_names.join(' / ')}</p>
            <p>{thisWeekMovie?.overview}</p>
            {isSunday ? (
              <p>월요일 부터 게시판이 열립니다</p>
            ) : (
              <>
                {session ? (
                  <>
                    {thisWeekMovie?.myReview ? (
                      <Link href={`/reviews/${thisWeekMovie?.myReview.reviewId}`}>
                        <div>
                          <p>{thisWeekMovie.myReview.reviewTitle}</p>
                          <p>{thisWeekMovie.myReview.rating}</p>
                          <p>{thisWeekMovie.myReview.reviewContent}</p>
                        </div>
                      </Link>
                    ) : certificationStatus === 'APPROVED' ? (
                      <Link className='btn' href='/board/create'>
                        게시글 작성하기
                      </Link>
                    ) : (
                      <Link href={`/profile/${session.user?.userId}/watch-verification`}>
                        시청 인증하고 게시글 작성하기
                      </Link>
                    )}
                  </>
                ) : (
                  <Link className='btn' href='/login'>
                    로그인 하고 글쓰기
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      {!isSunday && (
        <section>
          <h3>게시글</h3>
          <ul>
            {reviews?.content.map((review) => (
              <li key={review.reviewId}>
                <div className='flex justify-between'>
                  <Link className='flex' href={`/profile/${review.userId}`}>
                    {review.profileImageUrl ? (
                      <Image
                        src={`${review.profileImageUrl}`}
                        alt='프로필 사진'
                        width={20}
                        height={20}
                      />
                    ) : (
                      <CircleUserRound />
                    )}
                    <p>{review.nickname}</p>
                    {review.certified && <CircleCheck />}
                  </Link>
                  <p>{review.rating}</p>
                </div>
                <Link href={`/reviews/${review.reviewId}`}>
                  <div>
                    <p>{review.reviewTitle}</p>
                    <p>{review.reviewContent}</p>
                  </div>
                  <div className='flex'>
                    <ThumbsUp />
                    {review.likeCount}
                    <MessageCircle />
                    {review.commentCount}
                  </div>
                </Link>
                <hr />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
