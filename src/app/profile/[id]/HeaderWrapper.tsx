'use client'

import BaseHeader from '@/components/layout/MobileHeader/BaseHeader'
import GoBackHeader from '@/components/layout/MobileHeader/GoBackHeader'
import { useSearchParams } from 'next/navigation'

export default function HeaderWrapper() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const isFromNav = from === 'nav'

  // 네브에서 접근한 프로필이 아닐때 뒤로 가기 헤더
  return isFromNav ? <BaseHeader /> : <GoBackHeader />
}
