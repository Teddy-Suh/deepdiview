export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getMovie } from '@/lib/api/movie'
import { getVoteOptions } from '@/lib/api/vote'
import { participateVoteAction } from './actions'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function VotePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const voteOptions = await getVoteOptions(session?.accessToken)
  const moviePromises = voteOptions.tmdbIds.map((id) => getMovie(id.toString()))
  const movies = await Promise.all(moviePromises)

  return (
    <>
      <h2>투표 페이지</h2>
      <form action={participateVoteAction}>
        <ul className='flex'>
          {movies.map((movie) => (
            <li key={movie.id}>
              <label>
                <p>{movie.title}</p>
                <p>{movie.ratingStats.ratingAverage}</p>
                <p>{movie.genre_names}</p>
                <p>{movie.release_date}</p>
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                  alt='영화 포스터'
                  width={100}
                  height={150}
                />
                <p>{movie.overview}</p>
                <input type='radio' name='tmdbId' value={movie.id} />
              </label>
            </li>
          ))}
        </ul>
        <button className='btn' type='submit'>
          투표하기
        </button>
      </form>
    </>
  )
}
