'use client'

import { useMobileKeyboard } from '@/hooks/useMobileKeyboard'
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
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard()

  return (
    <div
      className={clsx(
        'container-wrapper fixed right-0 left-0 mt-6 w-full space-y-1 md:relative md:bottom-auto md:p-0',
        isKeyboardVisible ? 'bottom-2' : 'bottom-18'
      )}
      style={isKeyboardVisible ? { transform: `translateY(-${keyboardHeight}px)` } : undefined}
    >
      <button className='btn btn-primary w-full rounded-xl' type='submit' disabled={buttonDisabled}>
        {isPending ? <span className='loading loading-ring' /> : buttonLabel}
      </button>
      {children}
    </div>
  )
}
