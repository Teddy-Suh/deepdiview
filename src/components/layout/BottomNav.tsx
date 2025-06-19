'use client'

import { Bell, Home, KeyRound, NotebookPen, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { useSession } from '@/providers/providers'
import Image from 'next/image'
import NotificationBadge from '../ui/NotificationBadge'
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard'

export default function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFromNav = searchParams.get('from') === 'nav'
  const session = useSession()
  const { isKeyboardVisible } = useMobileKeyboard()

  return (
    <>
      <div className={clsx('pt-16 md:hidden', isKeyboardVisible && 'hidden')} />
      <nav className={clsx('dock z-40 md:hidden', isKeyboardVisible && 'hidden')}>
        <Link href='/' className={clsx({ 'dock-active text-primary': pathname === '/' })}>
          <Home />
        </Link>
        <Link
          href='/search'
          className={clsx({ 'dock-active text-primary': pathname.startsWith('/search') })}
        >
          <Search />
        </Link>
        <Link
          href='/board'
          className={clsx({ 'dock-active text-primary': pathname.startsWith('/board') })}
        >
          <NotebookPen />
        </Link>
        {session?.user ? (
          <>
            <Link
              href='/notifications'
              className={clsx({
                'dock-active text-primary': pathname.startsWith('/notifications'),
              })}
            >
              <div className='relative'>
                <Bell />
                <NotificationBadge />
              </div>
            </Link>
            <Link
              href={`/profile/${session.user.userId}?from=nav`}
              className={clsx({
                'dock-active text-primary': pathname.startsWith('/profile') && isFromNav,
              })}
            >
              <Image
                className='rounded-full'
                src={session.user.profileImageUrl}
                width={32}
                height={32}
                alt='프로필 사진'
              />
            </Link>
          </>
        ) : (
          <Link
            href='/login'
            className={clsx({
              'dock-active text-primary': pathname.startsWith('/login'),
            })}
          >
            <KeyRound />
          </Link>
        )}
      </nav>
    </>
  )
}
