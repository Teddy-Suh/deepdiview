'use client'

import { useKeyboardVisible } from '@/hooks/useKeyboardVisible'
import clsx from 'clsx'
import { ReactNode } from 'react'

export default function AuthSubmitButton({
  isPending,
  isValid,
  buttonLabel,
  buttonDisabled = !isValid || isPending,
  children,
}: {
  isPending: boolean
  isValid: boolean
  buttonLabel: string
  buttonDisabled?: boolean
  children?: ReactNode
}) {
  const isKeyboardVisible = useKeyboardVisible()
  return (
    <div
      className={clsx(
        'container-wrapper absolute right-0 left-0 mt-6 w-full space-y-1 md:relative md:bottom-auto md:p-0',
        isKeyboardVisible ? 'bottom-2' : 'bottom-18'
      )}
    >
      <button className='btn btn-primary w-full rounded-xl' type='submit' disabled={buttonDisabled}>
        {isPending ? <span className='loading loading-ring' /> : buttonLabel}
      </button>
      {children}
    </div>
  )
}
