import clsx from 'clsx'

export default function ReviewListLoading({
  withoutMovie = false,
  withMovie = false,
  withoutProfile = false,
  withComment = false,
  isCertification = false,
}: {
  withoutMovie?: boolean
  withMovie?: boolean
  withoutProfile?: boolean
  withComment?: boolean
  isCertification?: boolean
}) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={clsx(
            'skeleton rounded-3xl',
            withoutMovie && 'h-64',
            withMovie && 'aspect-5/4',
            withoutProfile && 'aspect-9/7',
            withComment && 'aspect-8/7',
            isCertification && 'h-[412px]'
          )}
        />
      ))}
    </div>
  )
}
