'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function GoBackHeader({ children }: { children?: ReactNode }) {
  const [hideHeader, setHideHeader] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScrollY = useRef(0)

  const pathname = usePathname()
  const router = useRouter()

  const overlaidPaths = ['/', '/board']
  const overlaidDynamicPaths = /^\/(movies)\/[^/]+$/.test(pathname)
  const isOverlaid = overlaidPaths.includes(pathname) || overlaidDynamicPaths

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY

      // 헤더 배경, 하단 보더 처리 (스크롤이 10px 이상 내려간 후에만 불투명 적용)
      setScrolled(currentY > 10)

      // 헤더 숨김 처리 (스크롤을 아래로 내릴 경우 숨기기, 위로 올리면 다시 보이기)
      if (currentY > lastScrollY.current && currentY > 5) {
        setHideHeader(true)
      } else if (currentY < lastScrollY.current) {
        setHideHeader(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div
        className={clsx(
          'container-wrapper fixed right-0 left-0 z-50 flex items-center border-b-1 transition-all duration-200 md:hidden',
          hideHeader ? 'h-0 overflow-hidden' : 'h-16',
          scrolled
            ? 'bg-base-300 border-b-gray-300 dark:border-b-gray-800'
            : 'border-b-transparent bg-transparent'
        )}
      >
        <div className='flex flex-1 items-center gap-2'>
          <button onClick={() => router.back()} type='button'>
            <ChevronLeft strokeWidth={3} />
          </button>
          {children ?? (
            <Link href='/'>
              <h1 className='text-primary text-2xl font-black'>DEEPDIVIEW</h1>
            </Link>
          )}
        </div>
      </div>
      {!isOverlaid && <div className='pb-16 md:hidden' />}
    </>
  )
}
