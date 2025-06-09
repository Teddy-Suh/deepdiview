import { useEffect, useState } from 'react'

// zustand 값을 사용하기 전에 클라이언트 하이드레이션 여부를 확인하는 훅
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
