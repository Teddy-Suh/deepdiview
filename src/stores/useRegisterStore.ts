'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface RegisterState {
  email: string
  verified: boolean
  password: string
  setEmail: (email: string) => void
  setVerified: (verified: boolean) => void
  setPassword: (password: string) => void
  reset: () => void
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      email: '',
      verified: false,
      password: '',
      setEmail: (email) => set({ email }),
      setVerified: (verified) => set({ verified }),
      setPassword: (password) => set({ password }),
      reset: () =>
        set({
          email: '',
          verified: false,
          password: '',
        }),
    }),
    {
      name: 'register-store',
      storage: createJSONStorage(() => sessionStorage), // 탭 닫을 때 삭제되는 세션 스토리지에 저장
    }
  )
)
