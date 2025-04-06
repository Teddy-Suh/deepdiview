import { getIsSunday, getThisWeekMovieId } from '@/lib/api/discussion'
import { getMovie, getPopularMovies } from '@/lib/api/movie'
import { getLatestReviews } from '@/lib/api/review'
import { CircleUserRound, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const [popularMovies, { isSunday }, latestReviews, { tmdbId }] = await Promise.all([
    getPopularMovies(),
    getIsSunday(),
    getLatestReviews(),
    getThisWeekMovieId(),
  ])

  const thisWeekMovie = await getMovie(String(tmdbId))

  return (
    <>
      <h2>홈페이지</h2>
      <section>
        <h3>인기 영화</h3>
        <ul className='flex'>
          {popularMovies.map((movie, index) => (
            <li key={movie.id}>
              <Link href={`/movies/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt='영화 포스터'
                  width={100}
                  height={150}
                />
                <h4>
                  {index + 1}위{movie.title}
                </h4>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <hr />
      <section>
        <h3>{isSunday ? '다음주 영화' : '이번주 영화'}</h3>
        <div className='flex'>
          <div>
            <Link href={`/movies/${thisWeekMovie.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${thisWeekMovie.poster_path}`}
                alt='영화 포스터'
                width={100}
                height={150}
              />
            </Link>
          </div>
          <div>
            <p>{thisWeekMovie.title}</p>
            <p>{thisWeekMovie.release_date}</p>
            <p>{thisWeekMovie.genre_names.join(' / ')}</p>
            <p>{thisWeekMovie.overview}</p>
            {isSunday ? (
              <p>월요일 부터 게시판이 열립니다</p>
            ) : (
              <Link className='btn' href='/board'>
                게시판으로 이동
              </Link>
            )}
          </div>
        </div>
      </section>
      <hr />
      <section>
        <h3>최신 리뷰</h3>
        <ul className='flex'>
          {latestReviews.map((review) => (
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
                <div className='flex'>
                  <div>
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${review.posterPath}`}
                      alt='영화 포스터'
                      width={100}
                      height={150}
                    />
                  </div>
                  <div>
                    <p>{review.movieTitle}</p>
                    <p>{review.reviewTitle}</p>
                    <p>{review.reviewContent}</p>
                  </div>
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
