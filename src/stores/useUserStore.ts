import { create } from 'zustand'

type UserState = {
  profileImageUrl: string | null
  setProfileImageUrl: (url: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  profileImageUrl: null,
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
}))
