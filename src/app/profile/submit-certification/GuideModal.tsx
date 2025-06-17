import { EXAMPLE_CERTIFICATION_IMAGES } from '@/constants/image'
import Image from 'next/image'

export default function GuideModal() {
  return (
    <div className='bg-base-100 absolute inset-0 z-50 flex w-full flex-col items-center overflow-y-scroll py-2'>
      <div className='max-w-[500px] gap-4 space-y-4 text-center'>
        <p className='text-xl font-bold break-keep'>✅ 다음 기준에 맞춰 인증샷을 제출해 주세요.</p>
        <div className='text-success space-y-1 text-center'>
          <p>🙆‍♀️ 스트리밍 플레이어 재생 화면</p>
          <Image
            src={EXAMPLE_CERTIFICATION_IMAGES[0]}
            width={2880}
            height={1800}
            alt='인증샷 예시 1'
          />
        </div>
        <div className='space-y-1 text-center'>
          <p className='text-success'>🙆‍♂️ 프로필의 시청 기록 화면</p>
          <Image
            src={EXAMPLE_CERTIFICATION_IMAGES[1]}
            width={2176}
            height={582}
            alt='인증샷 예시 2'
          />
        </div>
        <div className='divider' />
        <p className='text-xl font-bold break-keep'>
          ❌ 기준에 부합하지 않은 경우 거절될 수 있습니다.
        </p>
        <div className='text-error space-y-1 text-center'>
          <p>🙅‍♀️ 다른 영화나 관련 없는 이미지</p>
          <p>🙅‍♂️ 너무 흐리거나 식별이 어려운 이미지</p>
        </div>
      </div>
    </div>
  )
}
