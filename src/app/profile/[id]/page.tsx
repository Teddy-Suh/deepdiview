export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { signOutWithForm } from './actions'
import { getMyProfile, getUserProfile } from '@/lib/api/user'
import { Rating } from '@/types/api/user'
import Link from 'next/link'
import IntroForm from './IntroForm'
import ProfileImageForm from './ProfileImageForm'
import { redirect } from 'next/navigation'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const userId = session.user?.userId
  const { id } = await params
  const isCurrentUser = userId === Number(id)

  const role = session.user?.role

  let profile
  if (isCurrentUser) {
    profile = await getMyProfile(session?.accessToken)
  } else {
    profile = await getUserProfile(session?.accessToken, id)
  }

  console.log('api응답 유저 정보', profile)
  console.log('서버 세션 유저 정보', session.user)

  return (
    <>
      <section>
        <h2>{isCurrentUser ? '내 프로필' : '다른 사람 프로필'}</h2>
        <ProfileImageForm profileImageUrl={profile.profileImageUrl} />
        <p>닉네임: {profile.nickname}</p>
        <p>이메일: {profile.email}</p>
        <IntroForm isCurrentUser={isCurrentUser} oneLineIntro={profile.oneLineIntro ?? ''} />
      </section>
      <hr />
      <section>
        <h2>활동내역</h2>
        <div>
          <h3>별점 분포</h3>
          {/* TODO: 막대 그래프 */}
          {Array.from({ length: 10 }, (_, i) => (0.5 + i * 0.5).toFixed(1)).map((rating) => {
            const count = profile.ratingDistribution?.[rating as Rating] ?? 0
            return (
              <div key={rating}>
                <span>
                  {rating} / {count}
                </span>
              </div>
            )
          })}
        </div>
        <Link className='btn' href={`/profile/${id}/activity/reviews`}>
          작성한 리뷰 목록 {profile.reviewCount}
        </Link>
        <Link className='btn' href={`/profile/${id}/activity/comments`}>
          작성한 댓글 목록 {profile.commentCount}
        </Link>
      </section>
      <hr />
      {isCurrentUser && (
        <div>
          {profile.certificationStatus === 'APPROVED' ? (
            <Link className='btn' href='/board'>
              인증됨 게시판 페이지로 {profile.certificationStatus}
            </Link>
          ) : (
            <Link className='btn' href='/profile/watch-verification'>
              시청 인증 하기 {profile.certificationStatus}
            </Link>
          )}
          <Link className='btn' href='/profile/settings/nickname'>
            닉네임 수정
          </Link>
          <Link className='btn' href='/profile/settings/password'>
            비밀번호 수정
          </Link>
          <Link className='btn' href='/profile/settings/delete-account'>
            회원 탈퇴
          </Link>
          {role === 'ADMIN' && (
            <Link className='btn' href='/admin'>
              관리자 페이지
            </Link>
          )}
          <form action={signOutWithForm}>
            <button className='btn'>로그아웃</button>
          </form>
        </div>
      )}
    </>
  )
}
