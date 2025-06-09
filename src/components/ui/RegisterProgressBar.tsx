export default function RegisterProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className='flex w-full gap-1.5'>
      {Array.from({ length: 4 }).map((_, i) => (
        <progress
          key={i}
          className='progress progress-primary h-2.5 flex-1'
          value={i < currentStep ? 1 : 0}
          max={1}
        />
      ))}
    </div>
  )
}
