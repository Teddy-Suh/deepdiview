export default function AdminLoading() {
  return (
    <div className='container-wrapper mt-2 space-y-6'>
      <section>
        <h3 className='mb-3 text-xl font-semibold'>시청 인증 관리</h3>
        <div className='skeleton h-[72px] rounded-3xl' />
      </section>
      <section>
        <h3 className='mb-3 text-xl font-semibold'>투표 생성</h3>
        <div className='skeleton h-[72px] rounded-3xl' />
      </section>
    </div>
  )
}
