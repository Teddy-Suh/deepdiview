'use client'

import { Bell, Home, KeyRound, NotebookPen, Search, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'

export default function BottomNav() {
  const pathname = usePathname()
  // TODO: 바로 세션 변화 알아차리게 구현
  const { data: session } = useSession()

  return (
    <nav className='dock md:hidden'>
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
        href={session?.user ? `/profile/${session.user.userId}` : '/login'}
        className={clsx({
          'dock-active text-primary': pathname.startsWith('/profile'),
        })}
      >
        {session?.user ? <UserRound /> : <KeyRound />}
      </Link>
    </nav>
  )
}
