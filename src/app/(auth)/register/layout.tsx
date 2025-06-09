import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { ReactNode } from 'react'

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GoBackHeader>
        <h2 className='flex-1 text-xl font-semibold'>회원가입</h2>
      </GoBackHeader>
      {children}
    </>
  )
}
