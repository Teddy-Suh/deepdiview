export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie } from '@/lib/api/movie'
import { getVoteParticipationStatus } from '@/lib/api/vote'
import { CircleUserRound, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MoviesPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session, { tmdbId }] = await Promise.all([params, auth(), getThisWeekMovieId()])
  const isThisWeekMovie = Number(id) === tmdbId

  let participated = false
  if (session) {
    participated = (await getVoteParticipationStatus(session.accessToken)).participated
  }

  let movie
  try {
    movie = await getMovie(id, !!session, session?.accessToken)
  } catch (error) {
    if (error instanceof Error && error.message === 'MOVIE_NOT_FOUND') {
      return notFound()
    }
    throw error
  }

  return (
    <>
      <section
        className='flex h-96 bg-cover bg-center'
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div>
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            width={200}
            height={300}
            alt='포스터'
          />
        </div>
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.original_title}</p>
          <p>{movie.release_date}</p>
          <p>{movie.genre_names}</p>
          <p>{movie.ratingAverage}</p>
          <p>{movie.overview}</p>
        </div>
      </section>
      <section>
        <div>
          {/* 우선 가장 직관적이고 에러 안나게 구현해둠 */}
          {session ? (
            <>
              {movie.myReview ? (
                <Link href={`/reviews/${movie.myReview.reviewId}`}>
                  <h2>내 리뷰</h2>
                  <p>별점:{movie.myReview.rating}</p>
                  <p>제목:{movie.myReview.reviewTitle}</p>
                  <p>내용:{movie.myReview.reviewContent}</p>
                </Link>
              ) : (
                <>
                  {isThisWeekMovie ? (
                    <>
                      {participated ? (
                        <Link className='btn' href={`/board/create`}>
                          인증했으니 게시판 작성으로 가짐
                        </Link>
                      ) : (
                        <Link className='btn' href={`/movies/${id}/reviews/create`}>
                          인증 안햇으니 리뷰 작성으로 가짐
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link className='btn' href={`/movies/${id}/reviews/create`}>
                      리뷰 작성하러가기
                    </Link>
                  )}
                </>
              )}
            </>
          ) : (
            <Link className='btn' href='/login'>
              로그인 하고 리뷰 작성하기
            </Link>
          )}
        </div>
        <hr />
        <div className='flex justify-between'>
          <h2>리뷰</h2>
          <Link className='btn' href={`/movies/${id}/reviews`}>
            더보기
          </Link>
        </div>
        <ul className='flex'>
          {movie.reviews.map((review) => (
            <li key={review.reviewId}>
              <Link href={`/reviews/${review.reviewId}`}>
                <div className='flex'>
                  <div className='flex'>
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
                  </div>
                  <div>별점{review.rating}</div>
                </div>

                <div>
                  <p>{review.reviewTitle}</p>
                  <p>{review.reviewContent}</p>
                </div>

                <div className='flex'>
                  <ThumbsUp /> {review.likeCount}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
