import { Session } from 'next-auth'
import { Suspense } from 'react'
import CreateVoteWrapper from './CreateVoteWrapper'

export default function CreateVoteSection({
  session,
  isSunday,
}: {
  session: Session
  isSunday: boolean
}) {
  return (
    // 관리자 페이지 진입 시 '투표 생성 섹션'보다 '시청 인증 관리 페이지로 이동하는 경우가 더 많아
    // 관리가 페이지의 비동기가 끝나고 투표 생성에 필요한 비동기 하더라도 Suspense로 스트리밍 기반 로딩 처리함
    <section>
      <h3 className='mb-3 text-xl font-semibold'>투표 생성</h3>
      {isSunday ? (
        <Suspense fallback={<div className='skeleton h-[72px] rounded-2xl' />}>
          <CreateVoteWrapper session={session} />
        </Suspense>
      ) : (
        <div className='bg-base-300 flex flex-col items-center gap-4 rounded-2xl p-4 md:flex-row md:justify-between md:gap-0'>
          <p className='my-2'>투표는 일요일에만 생성할 수 있습니다.</p>
        </div>
      )}
    </section>
  )
}
