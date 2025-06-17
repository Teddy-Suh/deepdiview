export default function CropImageModalWrapper({
  onClose,
  onCrop,
  children,
}: {
  onClose: () => void
  onCrop: () => void
  children: React.ReactNode
}) {
  return (
    <div className='bg-base-100 fixed inset-0 z-50 flex flex-col'>
      <div className='bg-base-300 flex h-16 w-full shrink-0 items-center justify-between border-b-1 border-b-gray-700 px-2'>
        <button onClick={onClose} className='btn btn-secondary rounded-2xl'>
          취소
        </button>
        <button onClick={onCrop} className='btn btn-primary rounded-2xl'>
          자르기
        </button>
      </div>
      {children}
    </div>
  )
}
