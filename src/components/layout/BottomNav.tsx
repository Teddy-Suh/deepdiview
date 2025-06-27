'use client'

import { Bell, Home, KeyRound, NotebookPen, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import Image from 'next/image'
import NotificationBadge from '../ui/NotificationBadge'
import { useMobileKeyboard } from '@/hooks/useMobileKeyboard'
import { Session } from 'next-auth'
import { useUserStore } from '@/stores/useUserStore'

export default function BottomNav({ session }: { session: Session | null }) {
  const profileImageUrl = useUserStore((state) => state.profileImageUrl)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFromNav = searchParams.get('from') === 'nav'
  const { isKeyboardVisible } = useMobileKeyboard()

  return (
    <>
      <div className={clsx('pt-16 md:hidden', isKeyboardVisible && 'hidden')} />
      <nav
        className={clsx(
          'bg-base-300 dock z-40 border-t border-t-gray-200 md:hidden dark:border-t-gray-800',
          isKeyboardVisible && 'hidden'
        )}
      >
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
                src={profileImageUrl || session?.user.profileImageUrl}
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
