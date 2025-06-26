import React, { Suspense } from 'react'
import VoteLatestResultWrapper from './VoteLatestResultWrapper'
import { Session } from 'next-auth'
import VoteWrapper from './VoteWrapper'
import Link from 'next/link'

export default function VoteSection({
  isSunday,
  session,
}: {
  isSunday: boolean
  session: Session | null
}) {
  return (
    <section className='container-wrapper'>
      {
        // 일요일 유무
        isSunday ? (
          // 일요일 O
          // 지난주 투표 결과
          <>
            <h3 className='mb-3 text-xl font-semibold'>투표 결과</h3>
            <Suspense fallback={<div className='skeleton h-96 w-full rounded-2xl' />}>
              <VoteLatestResultWrapper />
            </Suspense>
          </>
        ) : (
          <>
            <h3 className='mb-3 text-xl font-semibold'>다음주 영화 투표</h3>
            {
              // 로그인 유무 (일요일 X)
              session ? (
                // 로그인 O
                // 투표 또는 진행중인 투표 결과 (접기 가능)
                <Suspense fallback={<div className='skeleton h-18 rounded-3xl' />}>
                  <VoteWrapper session={session} />
                </Suspense>
              ) : (
                // 로그인 X
                // 로그인 안내
                <div className='bg-base-300 flex flex-col items-center gap-4 rounded-3xl p-4 md:flex-row md:justify-between md:gap-0'>
                  <p className='text-center break-keep'>
                    <span className='font-bold'>DeepDiview</span> 의 회원이 되셔서 다음주 영화에
                    투표해 주세요!
                  </p>
                  <Link className='btn btn-primary' href='/login'>
                    로그인하고 투표하기
                  </Link>
                </div>
              )
            }
          </>
        )
      }
    </section>
  )
}
