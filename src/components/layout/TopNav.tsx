'use client'

import Link from 'next/link'
import SearchForm from '@/components/form/SearchForm'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import NotificationBadge from '../ui/NotificationBadge'
import { Session } from 'next-auth'
import { useUserStore } from '@/stores/useUserStore'

export default function TopNav({ session }: { session: Session | null }) {
  const profileImageUrl = useUserStore((state) => state.profileImageUrl)
  const [scrolled, setScrolled] = useState(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fullPath =
    searchParams.toString().length > 0 ? `${pathname}?${searchParams.toString()}` : pathname

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
          'fixed right-0 left-0 z-50 hidden border-b-1 transition-colors duration-200 md:block',
          !isOverlaid || scrolled
            ? 'bg-base-300 border-b-gray-300 dark:border-b-gray-800'
            : 'border-b-transparent text-gray-100'
        )}
      >
        <div className='container-wrapper flex h-16 items-center'>
          <div className='flex-1'>
            <Link
              className='btn btn-ghost hover:text-primary p-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
              href='/'
            >
              <h1 className='text-primary text-2xl font-black'>DEEPDIVIEW</h1>
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
                    src={profileImageUrl || session?.user.profileImageUrl}
                    width={35}
                    height={35}
                    alt='프로필 사진'
                  />
                </Link>
              </>
            ) : (
              <Link
                className='btn btn-ghost hover:text-primary p-0 text-base hover:border-transparent hover:bg-transparent hover:shadow-none'
                href={`/login?from=${encodeURIComponent(fullPath)}`}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>
      {!isOverlaid && <div className='hidden pb-16 md:block' />}
    </>
  )
}
