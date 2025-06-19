import { useEffect, useState } from 'react'

// 모바일 키보드 확인용 훅
export function useMobileKeyboard() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const threshold = 150
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height
        setIsKeyboardVisible(heightDiff > threshold)
        setKeyboardHeight(window.innerHeight - window.visualViewport.height)
      }
    }
    window.visualViewport?.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isKeyboardVisible, keyboardHeight }
}
