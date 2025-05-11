export default function RatingProgressChart({ ratingAverage }: { ratingAverage: number }) {
  const percentage = Math.round((ratingAverage / 5) * 100)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <>
      <div className='relative'>
        <svg viewBox='0 0 100 100' className='h-full w-full -rotate-90 transform'>
          <circle cx='50' cy='50' r={radius} className='fill-none stroke-gray-800 stroke-[10]' />
          <circle
            cx='50'
            cy='50'
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap='round'
            className='stroke-primary fill-none stroke-[10]'
          />
        </svg>

        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl'>
            {ratingAverage.toFixed(1)}
          </span>
        </div>
      </div>

      <p className='pt-4 text-center text-sm text-gray-300'>평균 별점</p>
    </>
  )
}
