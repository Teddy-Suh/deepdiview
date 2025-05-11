'use client'

import { RatingDistribution } from '@/types/api/common'

export default function RatingBarChart({
  ratingDistribution,
}: {
  ratingDistribution: RatingDistribution
}) {
  const max = Math.max(...Object.values(ratingDistribution))
  const maxKeys =
    max > 0
      ? Object.entries(ratingDistribution)
          .filter(([, v]) => v === max)
          .map(([k]) => k)
      : []

  return (
    <>
      <div className='flex h-full items-end justify-between'>
        {Object.entries(ratingDistribution).map(([key, value]) => {
          const isMax = maxKeys.includes(key)
          const isEdge = key === '0.5' || key === '5.0'
          const displayHeight =
            max === 0 ? '15px' : value === 0 ? '15px' : `${(value / max) * 100}%`

          return (
            <div
              key={key}
              className='flex h-full w-full flex-col items-center justify-end px-[1px]'
            >
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

      <p className='pt-4 text-center text-sm text-gray-300'>별점 그래프</p>
    </>
  )
}
