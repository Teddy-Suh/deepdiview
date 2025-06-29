import SearchHeader from '@/components/layout/MobileHeader/SearchHeader'
import { getSearchedMovies } from '@/lib/api/movie'
import SearchMovieItem from './SearchMovieItem'
import Pagination from './Pagination'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>
}) {
  const { title } = await searchParams
  return {
    title: title ? `${title} - 검색` : '검색',
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ title?: string; page?: string }>
}) {
  const { title = '', page = '1' } = await searchParams
  const trimmedTitle = title.trim()
  const pageNumber = Number(page)

  if (!trimmedTitle) {
    return (
      <>
        <SearchHeader />
        <div className='container-wrapper'>
          <p className='py-4'>검색어를 입력해 주세요.</p>
        </div>
      </>
    )
  }

  const {
    content: movies,
    totalElements,
    totalPages,
  } = await getSearchedMovies({ title: trimmedTitle, page: pageNumber - 1 })

  return (
    <>
      <SearchHeader />
      <div className='container-wrapper'>
        {movies.length === 0 ? (
          <p className='py-4'>
            &quot;<span className='font-bold'>{trimmedTitle}</span>&quot;에 대한 검색 결과가
            없습니다.
          </p>
        ) : (
          <>
            <p className='py-4'>
              &quot;<span className='font-bold'>{trimmedTitle}</span>&quot;의 검색 결과 (
              {totalElements})
            </p>
            <ul className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {movies.map((movie) => (
                <li key={movie.id}>
                  <SearchMovieItem movie={movie} />
                  <hr className='mt-4 text-gray-300 dark:text-gray-700' />
                </li>
              ))}
            </ul>
          </>
        )}
        <Pagination totalPages={totalPages} pageNumber={pageNumber} title={trimmedTitle} />
      </div>
    </>
  )
}
