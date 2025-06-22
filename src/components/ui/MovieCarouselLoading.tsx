export default function MovieCarouselLoading() {
  return (
    <div className='no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth md:gap-4'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className='skeleton aspect-2/3 w-[calc((100%-16px)/3)] flex-shrink-0 snap-start rounded-xl md:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)]'
        />
      ))}
    </div>
  )
}
