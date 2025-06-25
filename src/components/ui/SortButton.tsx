'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

export default function SortButton({
  pathPrefix,
  queryKey = 'sort',
  targetValue,
  currentValue,
  label,
}: {
  pathPrefix: string
  queryKey?: string
  targetValue: string
  currentValue: string
  label: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push(`${pathPrefix}?${queryKey}=${targetValue}`)
    })
  }

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className={clsx(
        'btn btn-primary w-[58.2px]',
        targetValue === currentValue ? 'pointer-events-none' : 'btn-soft'
      )}
    >
      {isPending ? <span className='loading loading-ring' /> : label}
    </button>
  )
}
