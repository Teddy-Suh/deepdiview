'use client'

import { CircleAlert, CircleCheck } from 'lucide-react'
import clsx from 'clsx'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { ReactNode } from 'react'

export default function AuthFormInput({
  type = 'text',
  placeholder,
  register,
  error,
  value,
  inputDisabled = false,
  children,
}: {
  type?: string
  placeholder: string
  register: UseFormRegisterReturn
  error?: FieldError
  value?: string
  inputDisabled?: boolean
  children?: ReactNode
}) {
  return (
    <div className='space-y-1'>
      <label className={clsx('user-input')}>
        <input
          {...register}
          type={type}
          placeholder={placeholder}
          className='grow'
          disabled={inputDisabled}
        />
        {/* !=="" 만 주면 첫 진입시 잠깐 CircleCheck뜸 그래서 (currentPassword ?? '')이걸로 막아줌  */}
        {/* 비어 있을떄 안뜨게 하기 !== '' */}
        {/* 비어 있을떄 noempty 에러는 뜸 input도 빨갛게 됨 하지만 글자 틀린건 없어서 아래꺼는 안보여줌 */}
        {(value ?? '') !== '' &&
          (error ? (
            <CircleAlert className='stroke-error/75' />
          ) : (
            <CircleCheck className='stroke-success/75' />
          ))}
      </label>
      {children ? (
        <>{children}</>
      ) : (
        <>{error && <p className='text-error px-2 text-sm'>{error.message}</p>}</>
      )}
    </div>
  )
}
