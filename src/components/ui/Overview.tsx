'use client'

import clsx from 'clsx'
import { useLayoutEffect, useRef, useState } from 'react'

export default function Overview({ overview }: { overview: string }) {
  const [expanded, setExpanded] = useState(false)
  const [isOverflow, setIsOverflow] = useState(false)
  const [hasManuallyExpanded, setHasManuallyExpanded] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return

    const handleResize = () => {
      const scrollExceeds = el.scrollHeight > el.clientHeight

      setIsOverflow(scrollExceeds)

      // 더보기를 누른 적 없는 경우에만 자동으로 접히게 함
      if (!scrollExceeds && !hasManuallyExpanded) {
        setExpanded(false)
      }

      // 반대로 줄이 넘치게 되었을 땐 자동으로 줄임 상태 복구
      if (scrollExceeds && expanded && !hasManuallyExpanded) {
        setExpanded(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [overview, expanded, hasManuallyExpanded])

  const handleToggle = () => {
    setExpanded((prev) => {
      const next = !prev
      setHasManuallyExpanded(next)
      return next
    })
  }

  return (
    <div className='flex'>
      <p className={clsx('text-justify', !expanded && 'line-clamp-3')} ref={textRef}>
        {(isOverflow || expanded) && (
          <button
            className='float-right ml-1 flex h-full items-end [shape-outside:inset(calc(100%-24px)_0_0)]'
            onClick={handleToggle}
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}
        {overview}
      </p>
    </div>
  )
}
