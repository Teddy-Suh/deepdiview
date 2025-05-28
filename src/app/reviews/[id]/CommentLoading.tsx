export default function CommentLoading() {
  return (
    <div className='space-y-2 py-2'>
      <div className='flex w-full items-center gap-1'>
        <div className='skeleton h-[25px] w-[25px] shrink-0 rounded-full' />
        <div className='skeleton h-[25px] w-full rounded-full' />
      </div>
      <div className='skeleton h-10 w-full rounded-2xl' />
    </div>
  )
}
