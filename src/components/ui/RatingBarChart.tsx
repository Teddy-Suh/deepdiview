'use client'

import { RatingDistribution } from '@/types/api/common'

export default function RatingBarChart({
  ratingDistribution,
  ratingAverage,
  isProfile = false,
}: {
  ratingDistribution: RatingDistribution
  ratingAverage?: number
  isProfile?: boolean
}) {
  const max = Math.max(...Object.values(ratingDistribution))
  const maxKeys =
    max > 0
      ? Object.entries(ratingDistribution)
          .filter(([, v]) => v === max)
          .map(([k]) => k)
      : []

  const ratingBarChart = (
    <div className='flex h-full items-end justify-between'>
      {Object.entries(ratingDistribution).map(([key, value]) => {
        const isMax = maxKeys.includes(key)
        const isEdge = key === '0.5' || key === '5.0'
        const displayHeight = max === 0 ? '15px' : value === 0 ? '15px' : `${(value / max) * 100}%`

        return (
          <div key={key} className='flex h-full w-full flex-col items-center justify-end px-[1px]'>
            {(isMax || isEdge) && (
              <div className={`mb-1 text-xs ${isMax ? 'text-primary' : 'text-gray-400'}`}>
                {key}
              </div>
            )}
            <div
              style={{ height: displayHeight }}
              className={`w-full rounded-t-full transition-all duration-300 ${
                isMax ? 'bg-primary' : 'bg-gray-800'
              }`}
            />
          </div>
        )
      })}
    </div>
  )

  if (!isProfile)
    return (
      <>
        {ratingBarChart}
        <p className='pt-4 text-center text-sm text-gray-300'>별점 그래프</p>
      </>
    )

  const [text, label] = getRatingComment(ratingDistribution, ratingAverage || 0)
  return (
    <>
      <div className='mb-5 space-y-1.5 md:mb-15'>
        <h3 className='text-xl font-semibold'>별점 분석</h3>
        <p>
          {text}
          <span className='font-bold'>{label}</span>
        </p>
      </div>
      {ratingBarChart}
    </>
  )
}

function getRatingComment(
  ratingDistribution: RatingDistribution,
  ratingAverage: number
): [string, string] {
  const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
  if (total === 0 || ratingAverage === 0) return ['아직 평가가 없습니다.', '']
  if (total < 10) return ['아직 평가가 적습니다.', '']

  if (ratingAverage >= 4.0) return ['좋은 작품을 잘 골라내는 안목이 있는 ', "'긍정파'"]
  if (ratingAverage >= 3.0) return ['작품의 장단점을 균형 있게 바라보는 ', "'균형파'"]
  if (ratingAverage >= 2.0) return ['자신만의 뚜렷한 기준을 지닌 ', "'분석파'"]
  return ['솔직하고 날카로운 시선으로 평가하는 ', "'비평파'"]
}
