'use client'

import { COMMON_CODES, COMMON_MESSAGES } from '@/constants/messages/common'
import { readAllNotificationsAction } from './actions'
import { useNotificationStore } from '@/stores/useNotificationStore'
import toast from 'react-hot-toast'

export default function ReadAllButton({ onReadAll }: { onReadAll: () => void }) {
  const hasUnread = useNotificationStore((state) => state.hasUnread)

  const handleClick = async () => {
    const result = await readAllNotificationsAction()
    if (result.code === COMMON_CODES.SUCCESS) {
      onReadAll()
      return
    }
    if (result.code === COMMON_CODES.NETWORK_ERROR) {
      toast.error(COMMON_MESSAGES.NETWORK_ERROR!)
      return
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
