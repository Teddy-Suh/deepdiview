'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { Session } from 'next-auth'
import { ReactNode, useEffect, useRef, useState } from 'react'

export default function VoteToggle({
  children,
  session,
  participated,
}: {
  children: ReactNode
  session: Session
  participated: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null) // 실제 height 감지할 대상
  const containerRef = useRef<HTMLDivElement>(null) // 애니메이션 줄 곳
  const [height, setHeight] = useState(0)

  // 열고 닫기 시 높이 설정
  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      setHeight(wrapperRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  // 리사이즈될 때에도 감지
  useEffect(() => {
    if (!wrapperRef.current) return

    const observer = new ResizeObserver(() => {
      if (isOpen && wrapperRef.current) {
        setHeight(wrapperRef.current.scrollHeight)
      }
    })

    observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  }, [isOpen])

  return (
    <div className='bg-base-300 overflow-hidden rounded-2xl px-4 py-6'>
      <button
        className='flex w-full justify-between'
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
        type='button'
      >
        <p className='flex-1 text-center break-keep md:text-start'>
          {participated ? (
            <>
              <span className='font-semibold'>{session.user?.nickname}</span> 님이 선택한 영화가
              다음주 영화로 선정될 수 있을지 확인해 보세요!
            </>
          ) : (
            <>
              지금 투표 진행 중이에요!{' '}
              <span className='font-semibold'>{session.user?.nickname}</span> 님의 흥미를 끄는
              영화에 투표해 주세요!
            </>
          )}
        </p>
        {isOpen ? (
          <ChevronUp className='hidden stroke-3 md:block' />
        ) : (
          <ChevronDown className='hidden stroke-3 md:block' />
        )}
      </button>

      <div
        ref={containerRef}
        className='overflow-hidden transition-all duration-300'
        style={{ height }}
      >
        <div ref={wrapperRef}>{children}</div>
      </div>

      <button
        className='flex w-full justify-center pt-4 md:hidden'
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
        type='button'
      >
        {isOpen ? <ChevronUp className='stroke-3' /> : <ChevronDown className='stroke-3' />}
      </button>
    </div>
  )
}
