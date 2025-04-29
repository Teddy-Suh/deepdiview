export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getMovie } from '@/lib/api/movie'
import { getVoteResult } from '@/lib/api/vote'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function VoteResultPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const { results } = await getVoteResult()
  const movieWithResultPromises = results.map(async (result) => {
    const movie = await getMovie(result.tmdbId.toString())
    return {
      ...result,
      ...movie,
    }
  })
  const movies = await Promise.all(movieWithResultPromises)

  return (
    <>
      <h2>진행중인 투표 결과</h2>
      <ul className='flex'>
        {movies.map((movie) => (
          <li key={movie.tmdbId}>
            <p>{movie.rank}위</p>
            <p>{movie.title}</p>
            <p>{movie.voteCount}표</p>
            <Link href={`/movies/${movie.id}`}>
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt='영화 포스터'
                width={100}
                height={150}
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
