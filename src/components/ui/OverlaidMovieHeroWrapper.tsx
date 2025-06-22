import { getMovie } from '@/lib/api/movie'
import OverlaidMovieHero from './OverlaidMovieHero'

export default async function OverlaidMovieHeroWrapper({
  movieId,
  isSunday,
}: {
  movieId: string
  isSunday: boolean
}) {
  const movie = await getMovie(movieId)
  return <OverlaidMovieHero movie={movie} isSunday={isSunday} />
}
