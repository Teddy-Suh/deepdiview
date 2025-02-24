import MovieCarousel from '@/components/ui/MovieCarousel'

async function getMovies() {
  try {
    const res = await fetch('http://43.202.153.204:8080/api/movies/popularity/top20', {
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch movies: ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function HomePage() {
  const movies = await getMovies()

  return (
    <>
      <MovieCarousel movies={movies} />
    </>
  )
}
