import { useEffect, useState } from 'react'

// 모바일 키보드 확인용 훅
export function useKeyboardVisible() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const initialHeight = window.innerHeight
    const handleResize = () => {
      const heightDiff = initialHeight - window.innerHeight
      setIsVisible(heightDiff > 150)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isVisible
}
