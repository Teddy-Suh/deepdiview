import Link from 'next/link'
import SearchForm from '@/components/form/SearchForm'
import { auth } from '@/auth'

export default async function TopNav() {
  const session = await auth()

  return (
    <nav className='navbar hidden px-0 md:flex'>
      <div className='flex-1'>
        <Link
          className='btn btn-ghost hover:text-primary pl-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
          href='/'
        >
          <h1 className='text-2xl font-bold'>Deepdiview</h1>
        </Link>
      </div>
      <div className='flex'>
        <SearchForm />
        <Link
          href='/board'
          className='btn btn-ghost hover:text-primary hover:bg-transparent hover:shadow-none'
        >
          <span className='text-base'>게시판</span>
        </Link>
        <Link
          href='/notifications'
          className='btn btn-ghost hover:text-primary pl-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
        >
          <span className='text-base'>알림</span>
        </Link>

        {session?.user ? (
          <Link
            className='btn btn-ghost hover:text-primary pl-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
            href={`/profile/${session.user.userId}`}
          >
            프로필
          </Link>
        ) : (
          <Link
            className='btn btn-ghost hover:text-primary pl-0 hover:border-transparent hover:bg-transparent hover:shadow-none'
            href='/login'
          >
            로그인
          </Link>
        )}
      </div>
    </nav>
  )
}
