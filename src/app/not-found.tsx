import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import Link from 'next/link'

export const metadata = {
  title: '404',
}

export default function NotFound() {
  return (
    <>
      <BaseHeader />
      <div className='container-wrapper flex flex-1 flex-col items-center justify-center gap-6'>
        <p className='text-primary text-8xl font-black'>404</p>
        <p className='text-lg font-semibold'>페이지를 찾을 수 없습니다.</p>
        <Link className='btn btn-primary' href='/'>
          홈으로 이동
        </Link>
      </div>
    </>
  )
}
