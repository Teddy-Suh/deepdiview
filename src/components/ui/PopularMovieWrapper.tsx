import { getPopularMovies } from '@/lib/api/movie'
import MovieCarousel from './MovieCarousel'

export default async function PopularMovieWrapper() {
  const popularMovies = await getPopularMovies()
  return <MovieCarousel movies={popularMovies} />
}
