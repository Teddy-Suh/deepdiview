import RegisterProgressBar from '@/components/ui/RegisterProgressBar'
import { ReactNode } from 'react'

export default function AuthFormWrapper({
  children,
  title,
  currentStep,
  description,
}: {
  children: ReactNode
  title: string
  currentStep?: number
  description?: string
}) {
  return (
    <div className='container-wrapper flex-1 md:flex md:items-center md:justify-center'>
      <div className='md:bg-base-300 md:flex md:flex-col md:gap-2 md:rounded-3xl md:p-8'>
        <h2 className='hidden text-center text-xl font-semibold md:mb-4 md:block'>{title}</h2>
        {currentStep && <RegisterProgressBar currentStep={currentStep} />}
        {description && <p className='mt-6 mb-1.5 font-semibold'>{description}</p>}
        {children}
      </div>
    </div>
  )
}
