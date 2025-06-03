'use client'

import { Bell, Home, KeyRound, NotebookPen, Search, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { useSession } from '@/providers/providers'
import { useEffect, useState } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFromNav = searchParams.get('from') === 'nav'

  const session = useSession()
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const threshold = 150 // 높이 차이가 이 이상이면 키보드가 올라왔다고 판단
    const initialHeight = window.innerHeight

    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight
      setIsKeyboardVisible(heightDiff > threshold)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
        <Link
          href='/notifications'
          className={clsx({ 'dock-active text-primary': pathname.startsWith('/notifications') })}
        >
          <Bell />
        </Link>
        <Link
          href={session?.user ? `/profile/${session.user.userId}?from=nav` : '/login'}
          className={clsx({
            'dock-active text-primary': pathname.startsWith('/profile') && isFromNav,
          })}
        >
          {session?.user ? <UserRound /> : <KeyRound />}
        </Link>
      </nav>
    </>
  )
}
