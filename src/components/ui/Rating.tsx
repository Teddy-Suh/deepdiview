import clsx from 'clsx'
import React from 'react'

export default function Rating({
  rating,
  readOnly = false,
}: {
  rating?: number
  readOnly?: boolean
}) {
  return (
    <div className='rating rating-half rating-sm'>
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
            key={number}
            {...commonProps}
            type='radio'
            name='rating'
            value={number}
            defaultChecked={number === (rating ?? 0.5)}
          />
        )
      })}
    </div>
  )
}
