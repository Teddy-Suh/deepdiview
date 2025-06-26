export default function OverlaidMovieHeroLoading({ isSunday }: { isSunday: boolean }) {
  return (
    <section className='overlaid-bg container-wrapper pt-16 pb-8'>
      <div className='relative z-10'>
        <h3 className='mb-3 text-xl font-semibold'>{isSunday ? '다음주 영화' : '이주의 영화'}</h3>

        <div className='flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-0 lg:px-6'>
          {/* 포스터 */}
          <div className='w-full flex-2 px-16 md:pr-6 md:pl-0 lg:pr-12 lg:pl-0'>
            <div className='skeleton relative aspect-2/3 w-full rounded-lg' />
          </div>

          {/* 정보 */}
          <div className='flex w-full flex-5 flex-col gap-4 md:gap-8 lg:gap-14'>
            {/* 상단 텍스트 */}
            <div className='space-y-2'>
              <div className='skeleton h-[32px] w-1/2' />
              <div className='skeleton h-[16px] w-1/3' />
              <div className='skeleton h-[16px] w-1/3' />
            </div>

            {/* 별점 차트 */}
            <div className='flex items-center gap-4 px-4 md:gap-16 md:px-20 lg:gap-20 lg:px-24'>
              <div className='skeleton aspect-square w-full flex-2 rounded-full' />
              <div className='skeleton aspect-5/2 w-full flex-5' />
            </div>

            {/* 줄거리 */}
            <div className='space-y-2'>
              <div className='skeleton h-[20px] w-full' />
              <div className='skeleton h-[20px] w-full' />
              <div className='skeleton h-[20px] w-full' />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
