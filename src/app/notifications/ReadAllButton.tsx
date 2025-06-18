'use client'

import { readAllNotificationsAction } from './actions'
import { useNotificationStore } from '@/stores/useNotificationStore'

export default function ReadAllButton({ onReadAll }: { onReadAll: () => void }) {
  const hasUnread = useNotificationStore((state) => state.hasUnread)

  const handleClick = async () => {
    const result = await readAllNotificationsAction()
    if (result.success) {
      onReadAll()
    }
  }

  return (
    <button
      className='btn btn-primary rounded-2xl'
      type='button'
      onClick={handleClick}
      disabled={!hasUnread}
    >
      전체 읽음
    </button>
  )
}
