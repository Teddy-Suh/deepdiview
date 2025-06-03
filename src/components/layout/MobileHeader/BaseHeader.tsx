'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BaseHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const overlaidPaths = ['/', '/board']
  const overlaidDynamicPaths = /^\/(movies)\/[^/]+$/.test(pathname)
  const isOverlaid = overlaidPaths.includes(pathname) || overlaidDynamicPaths

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div
        className={clsx(
          'container-wrapper fixed right-0 left-0 z-50 flex items-center overflow-hidden transition-all duration-100 md:hidden',
          scrolled ? 'h-0' : 'h-16'
        )}
      >
        <div className='flex-1'>
          <Link href='/'>
            <h1 className='text-2xl font-bold'>Deepdiview</h1>
          </Link>
        </div>
      </div>
      {!isOverlaid && <div className='pb-16 md:hidden' />}
    </>
  )
}
