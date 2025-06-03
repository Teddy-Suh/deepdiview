'use client'

import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { getCroppedImg } from '@/lib/utils/image'

export default function CropImageModal({
  imageUrl,
  onClose,
  onCropDone,
}: {
  imageUrl: string
  onClose: () => void
  onCropDone: (blob: Blob) => void
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropDone = async () => {
    if (!croppedAreaPixels) return

    try {
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels)
      onCropDone(blob)
    } catch (error) {
      console.error('CROP_FAILED', error)
    }
  }

  return (
    <div className='bg-base-100 fixed inset-0 z-50 flex flex-col'>
      <div className='bg-base-300 flex h-16 w-full items-center justify-between border-b-1 border-b-gray-700 px-2'>
        <button onClick={onClose} className='btn btn-secondary rounded-2xl'>
          취소
        </button>
        <button onClick={handleCropDone} className='btn btn-primary rounded-2xl'>
          자르기
        </button>
      </div>
      <div className='relative h-full w-full'>
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          cropShape='round'
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
    </div>
  )
}
