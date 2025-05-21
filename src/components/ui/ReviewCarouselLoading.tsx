export default function ReviewCarouselLoading() {
  return (
    <section className='container-wrapper'>
      <div className='flex justify-between'>
        <h3 className='mb-3 text-xl font-semibold'>최신 리뷰</h3>
      </div>

      <div className='no-scrollbar flex gap-2 overflow-x-auto lg:gap-3'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='skeleton h-56 w-full flex-shrink-0 rounded-xl md:w-[calc((100%-8px)/2)] lg:w-[calc((100%-24px)/3)]'
          />
        ))}
      </div>
    </section>
  )
}
