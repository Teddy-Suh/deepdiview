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
  setIsPending,
}: {
  pathPrefix: string
  queryKey?: string
  targetValue: string
  currentValue: string
  label: string
  setIsPending?: (state: boolean) => void
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    setIsPending?.(true)
    startTransition(() => {
      const separator = pathPrefix.includes('?') ? '&' : '?'
      router.push(`${pathPrefix}${separator}${queryKey}=${targetValue}`)
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
