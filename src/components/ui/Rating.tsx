'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

export default function Rating({
  rating,
  readOnly = false,
  register,
}: {
  rating?: number
  readOnly?: boolean
  register?: UseFormRegisterReturn
}) {
  const [selected, setSelected] = useState(rating)

  return (
    <div
      className={clsx(!readOnly && 'flex min-h-7 w-full items-center justify-between md:min-h-8')}
    >
      <div
        className={clsx('rating rating-half', readOnly ? 'rating-sm' : 'rating-md md:rating-lg')}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const number = (i + 1) / 2

          const commonProps = {
            className: clsx(
              'mask mask-star-2 bg-primary',
              number % 1 === 0 ? 'mask-half-2' : 'mask-half-1'
            ),
            'aria-label': `${number} star`,
          }

          return readOnly ? (
            <div key={number} {...commonProps} aria-current={rating === number} />
          ) : (
            <input
              {...register}
              key={number}
              {...commonProps}
              type='radio'
              name='rating'
              value={number}
              defaultChecked={number === rating}
              onChange={() => setSelected(number)}
              required
            />
          )
        })}
      </div>
      {!readOnly &&
        (() => {
          const [emoji, text] = getRatingMessage(selected)
          return (
            <div className='flex items-center gap-1 md:gap-2'>
              <p className='text-xl font-semibold md:text-2xl'>{emoji}</p>
              <p className='text-base text-gray-400 md:text-lg'>{text}</p>
            </div>
          )
        })()}
    </div>
  )
}

function getRatingMessage(rating: number | undefined): [emoji: string, message: string] {
  switch (rating) {
    case 5.0:
      return ['🤩', '인생 영화네요!']
    case 4.5:
      return ['😍', '재밌게 보셨네요!']
    case 4.0:
      return ['😆', '좋은 영화네요!']
    case 3.5:
      return ['🙂', '무난하게 보셨네요']
    case 3.0:
      return ['😐', '평범했군요']
    case 2.5:
      return ['🙁', '아쉬웠나 봐요']
    case 2.0:
      return ['😨', '별로였군요']
    case 1.5:
      return ['😰', '실망하셨나 봐요']
    case 1.0:
      return ['😱', '헉...']
    case 0.5:
      return ['🥶', '최악이군요...']
    default:
      return ['🤔', '별점이 궁금해요!']
  }
}
