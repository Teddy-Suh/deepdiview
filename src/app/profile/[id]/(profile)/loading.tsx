// 설정 버튼은 내 프로필에서만 보여지므로 스켈레톤도 생략함.
// 다른 사람 프로필에서 '설정 페이지 이동 버튼' 스켈레톤이 나왔다가 실제 콘텐츠가 없으면 UX적으로 어색할 수 있다고 생각함.
// 따라서 메인 콘텐츠(ProfileWrapper: 프로필 정보 + 별점 분포)만 스켈레톤 처리함.

export default function loading() {
  return (
    <div className='container-wrapper flex flex-col md:flex-1 md:items-center md:justify-center'>
      <div className='w-full space-y-4 md:flex md:items-center md:justify-center md:gap-4 md:space-y-0'>
        <div className='skeleton h-[380px] rounded-3xl md:flex-1 lg:flex-2' />
        <div className='skeleton h-[250px] rounded-3xl md:h-[380px] md:flex-1' />
      </div>
    </div>
  )
}
