import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'

export default function ReviewSectionLoading() {
  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>리뷰</h2>
      </GoBackHeader>
      <div className='container-wrapper md:px-24 lg:px-32'>
        <h2 className='mt-4 mb-3 hidden text-xl font-semibold md:block'>리뷰</h2>
        <div className='skeleton h-[465px] rounded-xl' />
      </div>
    </>
  )
}
