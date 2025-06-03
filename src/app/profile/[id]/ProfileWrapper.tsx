'use client'

import Link from 'next/link'
import IntroForm from './IntroForm'
import NicknameForm from './NicknameForm'
import ProfileImageForm from './ProfileImageForm'
import RatingBarChart from '@/components/ui/RatingBarChart'
import { ProfileResponse } from '@/types/api/user'
import { useState } from 'react'
import { Settings, X } from 'lucide-react'

export default function ProfileWrapper({
  profile,
  isCurrentUser,
  id,
  isSunday,
}: {
  profile: ProfileResponse
  isCurrentUser: boolean
  id: string
  isSunday: boolean
}) {
  const [isEdit, setIsEdit] = useState(false)

  const certificationStatusMap = {
    APPROVED: '🟢 인증됨',
    PENDING: '🟡 심사 중',
    REJECTED: '🔴 거절됨',
    NONE: '인증 하기',
  } as const

  const statusKey = profile.certificationStatus ?? 'NONE'
  const certificationStatusLabel = certificationStatusMap[statusKey]

  return (
    <>
      {/* 프로필 정보 섹션, 별점 그래프 섹션 flex container */}
      <div className='w-full space-y-4 md:flex md:items-center md:justify-center md:gap-4 md:space-y-0'>
        {/* 프로필 정보 섹션 */}
        <section className='bg-base-300 relative flex h-[380px] flex-col justify-between gap-4 rounded-2xl p-4 md:flex-1 lg:flex-2'>
          {isCurrentUser && (
            <button
              className='absolute top-4 right-4 text-gray-500'
              type='button'
              onClick={() => {
                setIsEdit((prev) => !prev)
              }}
            >
              {isEdit ? <X className='stroke-3' /> : <Settings />}
            </button>
          )}
          {/* 프사 + 닉네임 + 이메일 */}
          <div className='flex flex-1 flex-col items-center justify-center gap-2 lg:gap-3'>
            <ProfileImageForm
              profileImageUrl={profile.profileImageUrl}
              readOnly={!isCurrentUser}
              isEdit={isEdit}
            />
            <NicknameForm
              nickname={profile.nickname}
              isCurrentUser={isCurrentUser}
              isEdit={isEdit}
            />
            {isCurrentUser && <p className='-mt-4 mb-1 text-xs text-gray-500'>{profile.email}</p>}
            {/* 한줄 소개 */}
            <IntroForm
              isCurrentUser={isCurrentUser}
              oneLineIntro={profile.oneLineIntro || ''}
              isEdit={isEdit}
            />
          </div>
          <div className='flex'>
            <Link
              className='flex-1 space-y-0.5 text-center'
              href={`/profile/${id}/activity/reviews`}
            >
              <p className='text-xl font-bold'>{profile.reviewCount}</p>
              <p className='text-sm'>리뷰</p>
            </Link>
            <div className='divider divider-horizontal' />
            <Link
              className='flex-1 space-y-0.5 text-center'
              href={`/profile/${id}/activity/comments`}
            >
              <p className='text-xl font-bold'>{profile.commentCount}</p>
              <p className='text-sm'>댓글</p>
            </Link>
            {isCurrentUser && !isSunday && (
              <>
                <div className='divider divider-horizontal' />
                {profile.certificationStatus === 'APPROVED' ? (
                  <Link className='flex-1 space-y-0.5 text-center' href='/board'>
                    <p className='text-base leading-[30px] font-black'>
                      {certificationStatusLabel}
                    </p>
                    <p className='text-sm'>시청 인증</p>
                  </Link>
                ) : (
                  <Link className='flex-1 text-center' href='/profile/watch-verification'>
                    <p className='text-base leading-[30px] font-black'>
                      {certificationStatusLabel}
                    </p>
                    <p className='text-sm'>시청 인증</p>
                  </Link>
                )}
              </>
            )}
          </div>
        </section>

        {/* 별점 분석 */}
        <section className='bg-base-300 flex h-[250px] flex-col gap-4 rounded-2xl p-4 md:h-[380px] md:flex-1'>
          <RatingBarChart
            ratingDistribution={profile.ratingStats.ratingDistribution}
            ratingAverage={profile.ratingStats.ratingAverage}
            isProfile
          />
        </section>
      </div>
    </>
  )
}
