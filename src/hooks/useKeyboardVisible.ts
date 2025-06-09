import { useEffect, useState } from 'react'

// 모바일 키보드 확인용 훅
export function useKeyboardVisible() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const threshold = 150 // 키보드 예상 최소 높이
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height
        setIsVisible(heightDiff > threshold)
      }
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    handleResize() // 초기 실행

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  return isVisible
}
