import PaginationButton from './PaginationButton'

export default function Pagination({
  totalPages,
  pageNumber,
  title,
}: {
  totalPages: number
  pageNumber: number
  title: string
}) {
  return (
    <>
      {totalPages > 1 && (
        <div className='join mt-2 w-full justify-center md:mt-4'>
          {pageNumber > 3 && (
            <>
              <PaginationButton targetPage={1} currentPage={pageNumber} title={title} />
              {pageNumber > 4 && (
                <button className='join-item btn btn-sm md:btn-md btn-disabled'>···</button>
              )}
            </>
          )}
          {Array.from({ length: 5 }).map((_, i) => {
            const targetPage = pageNumber - 2 + i
            if (targetPage < 1 || targetPage > totalPages) return null
            return (
              <PaginationButton
                key={targetPage}
                targetPage={targetPage}
                currentPage={pageNumber}
                title={title}
              />
            )
          })}
          {pageNumber + 2 < totalPages && (
            <>
              {pageNumber + 3 < totalPages && (
                <button className='join-item btn btn-sm btn-disabled md:btn-md'>···</button>
              )}
              <PaginationButton targetPage={totalPages} currentPage={pageNumber} title={title} />
            </>
          )}
        </div>
      )}
    </>
  )
}
