import SearchHeader from '@/components/layout/MobileHeader/SearchHeader'
import { getSearchedMovies } from '@/lib/api/movie'
import SearchMovieItem from './SearchMovieItem'
import Link from 'next/link'
import clsx from 'clsx'

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
        {totalPages > 1 && (
          <div className='join mt-2 w-full justify-center md:mt-4'>
            {pageNumber > 3 && (
              <>
                <Link
                  className='join-item btn btn-sm md:btn-md'
                  key={1}
                  href={`/search?title=${encodeURIComponent(trimmedTitle)}&page=1`}
                >
                  1
                </Link>
                {pageNumber > 4 && (
                  <button className='join-item btn btn-sm md:btn-md btn-disabled'>···</button>
                )}
              </>
            )}
            {Array.from({ length: 5 }).map((_, i) => {
              const targetPage = pageNumber - 2 + i
              if (targetPage < 1 || targetPage > totalPages) return null
              return (
                <Link
                  className={clsx(
                    'join-item btn btn-sm md:btn-md',
                    targetPage === pageNumber && 'bg-primary pointer-events-none'
                  )}
                  key={targetPage}
                  href={`/search?title=${encodeURIComponent(trimmedTitle)}&page=${targetPage}`}
                >
                  {targetPage}
                </Link>
              )
            })}
            {pageNumber + 2 < totalPages && (
              <>
                {pageNumber + 3 < totalPages && (
                  <button className='join-item btn btn-sm btn-disabled md:btn-md'>···</button>
                )}
                <Link
                  className='join-item btn btn-sm md:btn-md'
                  key={totalPages}
                  href={`/search?title=${encodeURIComponent(trimmedTitle)}&page=${totalPages}`}
                >
                  {totalPages}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
