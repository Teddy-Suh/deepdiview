'use client'

import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import CropImageModalWrapper from '@/components/ui/CropImageModalWrapper'

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

  const onCrop = async () => {
    if (!croppedAreaPixels) return

    const image = new Image()
    image.src = imageUrl

    const canvas = document.createElement('canvas')
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No 2d context')

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    canvas.toBlob((blob) => {
      if (blob) onCropDone(blob)
    }, 'image/jpeg')
  }

  return (
    <CropImageModalWrapper onClose={onClose} onCrop={onCrop}>
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
    </CropImageModalWrapper>
  )
}
