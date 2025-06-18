'use client'

import { Notification } from '@/types/api/notification'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface NotificationState {
  hasUnread: boolean | null
  sseNotification: Notification | null
  setHasUnread: (hasUnread: boolean) => void
  setSseNotification: (sseNotification: Notification | null) => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      hasUnread: null,
      sseNotification: null,
      dropdownNotifications: [],
      setHasUnread: (hasUnread) => set({ hasUnread }),
      setSseNotification: (sseNotification: Notification | null) => set({ sseNotification }),
      reset: () =>
        set({
          hasUnread: null,
          sseNotification: null,
        }),
    }),
    {
      name: 'notification-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
