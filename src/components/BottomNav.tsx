'use client'
import { Bell, Home, NotebookPen, Search, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function BottomNav() {
  const pathname = usePathname()
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
        href='/profile'
        className={clsx({ 'dock-active text-primary': pathname.startsWith('/profile') })}
      >
        <UserRound />
      </Link>
    </nav>
  )
}
