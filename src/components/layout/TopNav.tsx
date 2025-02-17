import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function TopNav() {
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
        <label className='input focus-within:border-primary focus-within:outline-none'>
          <Search className='h-[1em] opacity-50' />
          <input type='search' required placeholder='영화 제목을 입력해주세요.' />
        </label>
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
        <Link
          href='/profile'
          className='btn btn-ghost btn-circle avatar border-base-content hover:border-primary border-2'
        >
          <div className='relative w-full rounded-full'>
            <Image
              src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
              alt='프로필 사진'
              fill
            />
          </div>
        </Link>
      </div>
    </nav>
  )
}
