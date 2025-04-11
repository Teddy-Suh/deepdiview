import SearchForm from '@/components/form/SearchForm'
import { getSearchedMovies } from '@/lib/api/movie'
import Image from 'next/image'
import Link from 'next/link'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>
}) {
  const { title = '' } = await searchParams

  // 검색어가 없는 경우
  if (!title.trim()) {
    return (
      <>
        <div className='md:hidden'>
          <SearchForm />
        </div>
        <p>검색어를 입력해주세요.</p>
      </>
    )
  }

  // 검색 결과가 없는 경우
  let movies = []
  try {
    movies = await getSearchedMovies(title)
  } catch (error) {
    const errorCode = (error as Error).message
    if (errorCode === 'KEYWORD_NOT_FOUND') {
      return (
        <>
          <div className='md:hidden'>
            <SearchForm />
          </div>
          <p>{title}에 대한 검색 결과가 없습니다.</p>
        </>
      )
    } else {
      throw error
    }
  }

  return (
    <>
      <div className='md:hidden'>
        <SearchForm />
      </div>
      <h2>{title}에 대한 검색 결과</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link href={`/movies/${movie.id}`}>
              <p>{movie.title}</p>
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
