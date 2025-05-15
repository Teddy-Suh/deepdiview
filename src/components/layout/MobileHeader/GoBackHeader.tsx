'use client'

import { ReactNode, useEffect, useState } from 'react'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function GoBackHeader({ children }: { children?: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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
        <div className='flex flex-1 gap-2'>
          <button onClick={() => router.back()} type='button'>
            <ChevronLeft strokeWidth={3} />
          </button>
          {children ?? (
            <Link href='/'>
              <h1 className='text-2xl font-bold'>Deepdiview</h1>
            </Link>
          )}
        </div>
      </div>
      {!isOverlaid && <div className='pb-16 md:hidden' />}
    </>
  )
}
