'use client'

import { useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function PaginationButton({
  targetPage,
  currentPage,
  title,
}: {
  targetPage: number
  currentPage: number
  title: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (targetPage === currentPage) return
    startTransition(() => {
      const params = new URLSearchParams()
      params.set('title', title)
      params.set('page', String(targetPage))
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isPending}
      className={clsx(
        'join-item btn btn-sm md:btn-md w-[38.74px] md:w-[49.07px]',
        targetPage === currentPage && 'bg-primary pointer-events-none'
      )}
    >
      {isPending ? <span className='loading loading-ring' /> : targetPage}
    </button>
  )
}
