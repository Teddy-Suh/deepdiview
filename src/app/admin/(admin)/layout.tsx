import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { ReactNode } from 'react'

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>관리자 페이지</h2>
      </GoBackHeader>
      <div className='container-wrapper'>
        <div className='mb-3 hidden md:mt-4 md:block'>
          <h2 className='text-xl font-semibold'>관리자 페이지</h2>
        </div>
      </div>
      {children}
    </>
  )
}
