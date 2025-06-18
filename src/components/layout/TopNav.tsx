'use client'

import Link from 'next/link'
import SearchForm from '@/components/form/SearchForm'
import { useSession } from '@/providers/providers'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import NotificationBadge from '../ui/NotificationBadge'

export default function TopNav() {
  const session = useSession()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const overlaidPaths = ['/', '/board']
  const overlaidDynamicPaths = /^\/(movies)\/[^/]+$/.test(pathname)
  const isOverlaid = overlaidPaths.includes(pathname) || overlaidDynamicPaths

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={clsx(
          'container-wrapper fixed right-0 left-0 z-50 hidden h-16 items-center border-b-1 transition-colors duration-200 md:flex',
          !isOverlaid || scrolled ? 'bg-base-100 border-b-gray-700' : 'border-b-transparent'
        )}
      >
        <div className='flex-1'>
          <Link
            className='btn btn-ghost hover:text-primary p-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
            href='/'
          >
            <h1 className='text-2xl font-bold'>Deepdiview</h1>
          </Link>
        </div>
        <div className='hidden md:flex md:gap-6'>
          <SearchForm />
          <Link
            href='/board'
            className='btn btn-ghost hover:text-primary p-0 text-base hover:border-transparent hover:bg-transparent hover:shadow-none'
          >
            게시판
          </Link>

          {session?.user ? (
            <>
              <Link
                href='/notifications'
                className='btn btn-ghost hover:text-primary p-0 text-base hover:border-transparent hover:bg-transparent hover:shadow-none'
              >
                <div className='relative'>
                  알림
                  <NotificationBadge />
                </div>
              </Link>
              <Link
                className='btn btn-ghost hover:text-primary p-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
                href={`/profile/${session.user.userId}?from=nav`}
              >
                <Image
                  className='rounded-full'
                  src={session.user.profileImageUrl}
                  width={35}
                  height={35}
                  alt='프로필 사진'
                />
              </Link>
            </>
          ) : (
            <Link
              className='btn btn-ghost hover:text-primary p-0 text-base hover:border-transparent hover:bg-transparent hover:shadow-none'
              href='/login'
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
      {!isOverlaid && <div className='hidden pb-16 md:block' />}
    </>
  )
}
