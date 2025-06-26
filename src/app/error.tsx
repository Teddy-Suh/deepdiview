'use client'

import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import { CircleAlert } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: '에러',
}

export default function Error() {
  return (
    <>
      <BaseHeader />
      <div className='container-wrapper flex flex-1 flex-col items-center justify-center gap-6'>
        <CircleAlert className='stroke-primary' size={100} />
        <p className='text-lg font-semibold'>예상치 못한 에러가 발생했습니다.</p>
        <Link className='btn btn-primary rounded-2xl' href='/'>
          홈으로 이동
        </Link>
      </div>
    </>
  )
}
