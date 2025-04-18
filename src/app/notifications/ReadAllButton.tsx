'use client'

import { useActionState, useEffect, useRef } from 'react'
import { readAllNotificationsAction } from './actions'

export default function ReadAllButton({ onReadAll }: { onReadAll: () => void }) {
  const [state, formAction] = useActionState(readAllNotificationsAction, {
    message: '',
  })

  const calledRef = useRef(false)

  useEffect(() => {
    if (state.message === 'success' && !calledRef.current) {
      calledRef.current = true
      onReadAll()
    }
  }, [state.message, onReadAll])

  return (
    <form action={formAction}>
      <button className='btn'>전체 읽음</button>
    </form>
  )
}
